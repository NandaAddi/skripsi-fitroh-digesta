/**
 * DIGESTA - Admin & Teacher Management Service
 * 
 * Mengelola autentikasi sesi Guru/Admin (PIN), pengambilan rekap data kuis,
 * penghitungan statistik kelas (KKM), penghapusan data, dan ekspor CSV/Excel.
 */

import { supabase } from './supabaseClient';

export interface QuizScoreRow {
  id: string;
  studentId?: string;
  studentName: string;
  attendanceNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
  createdAt: string;
}

export interface ClassStatistics {
  totalAttempts: number;
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passedCount: number;
  failedCount: number;
  passingRate: number; // Persentase 0-100%
}

const ADMIN_SESSION_KEY = 'digesta_admin_authenticated';
const LOCAL_SCORES_KEY = 'digesta_quiz_scores_local';

export const adminService = {
  /**
   * Mendapatkan PIN Admin dari environment variable atau default '123456'
   */
  getAdminPin(): string {
    return (import.meta.env.VITE_ADMIN_PIN as string | undefined)?.trim() || '123456';
  },

  /**
   * Memverifikasi PIN Guru
   */
  verifyPin(inputPin: string): boolean {
    const clean = inputPin.trim();
    return clean === this.getAdminPin();
  },

  /**
   * Mengecek apakah sesi admin sedang aktif di sessionStorage
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  },

  /**
   * Mengatur status autentikasi sesi admin
   */
  setAuthenticated(status: boolean): void {
    if (typeof window === 'undefined') return;
    if (status) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  },

  /**
   * Mengambil seluruh rekaman nilai kuis siswa dari Supabase (atau fallback lokal)
   */
  async getAllScores(): Promise<QuizScoreRow[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('quiz_scores')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((item) => ({
            id: item.id,
            studentId: item.student_id,
            studentName: item.student_name,
            attendanceNumber: Number(item.attendance_number),
            score: Number(item.score),
            correctCount: Number(item.correct_count),
            totalQuestions: Number(item.total_questions),
            durationSeconds: Number(item.duration_seconds),
            createdAt: item.created_at,
          }));
        }
      } catch (err) {
        console.warn('[DIGESTA Admin] Gagal memuat skor dari Supabase:', err);
      }
    }

    // Fallback lokal jika offline
    try {
      const localStr = localStorage.getItem(LOCAL_SCORES_KEY);
      if (localStr) {
        const parsed: QuizScoreRow[] = JSON.parse(localStr);
        return parsed.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    } catch {
      // Abaikan error parse
    }

    return [];
  },

  /**
   * Menghapus 1 baris rekaman nilai kuis berdasarkan ID
   */
  async deleteScore(id: string): Promise<{ success: boolean; error: string | null }> {
    // Hapus dari localStorage
    try {
      const localStr = localStorage.getItem(LOCAL_SCORES_KEY);
      if (localStr) {
        const parsed: QuizScoreRow[] = JSON.parse(localStr);
        const filtered = parsed.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(filtered));
      }
    } catch {
      // Abaikan
    }

    // Hapus dari Supabase jika terhubung
    if (supabase) {
      try {
        const { error } = await supabase.from('quiz_scores').delete().eq('id', id);
        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Koneksi database gagal';
        return { success: false, error: msg };
      }
    }

    return { success: true, error: null };
  },

  /**
   * Mereset seluruh rekaman nilai kuis siswa
   */
  async resetAllScores(): Promise<{ success: boolean; error: string | null }> {
    // Kosongkan localStorage
    try {
      localStorage.removeItem(LOCAL_SCORES_KEY);
    } catch {
      // Abaikan
    }

    // Kosongkan tabel quiz_scores di Supabase
    if (supabase) {
      try {
        const { error } = await supabase
          .from('quiz_scores')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Koneksi database gagal';
        return { success: false, error: msg };
      }
    }

    return { success: true, error: null };
  },

  /**
   * Menghitung ringkasan statistik kelas (KKM 75 standar)
   */
  computeStatistics(scores: QuizScoreRow[], kkm = 75): ClassStatistics {
    if (scores.length === 0) {
      return {
        totalAttempts: 0,
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passedCount: 0,
        failedCount: 0,
        passingRate: 0,
      };
    }

    const uniqueStudents = new Set(
      scores.map((s) => `${s.studentName.toLowerCase()}_${s.attendanceNumber}`)
    );
    const scoreValues = scores.map((s) => s.score);
    const sumScore = scoreValues.reduce((a, b) => a + b, 0);
    const avg = Math.round(sumScore / scores.length);
    const max = Math.max(...scoreValues);
    const min = Math.min(...scoreValues);

    const passed = scores.filter((s) => s.score >= kkm).length;
    const failed = scores.length - passed;
    const rate = Math.round((passed / scores.length) * 100);

    return {
      totalAttempts: scores.length,
      totalStudents: uniqueStudents.size,
      averageScore: avg,
      highestScore: max,
      lowestScore: min,
      passedCount: passed,
      failedCount: failed,
      passingRate: rate,
    };
  },

  /**
   * Mengekspor rekaman nilai siswa ke berkas CSV yang kompatibel langsung dengan Microsoft Excel
   */
  exportScoresToCsv(scores: QuizScoreRow[], kkm = 75): void {
    if (scores.length === 0) return;

    // Header CSV
    const headers = [
      'No',
      'Nama Siswa',
      'Nomor Absen',
      'Nilai Akhir',
      'Jumlah Benar',
      'Total Soal',
      'Durasi Pengerjaan',
      'Status KKM (>= ' + kkm + ')',
      'Tanggal & Waktu',
    ];

    const rows = scores.map((row, index) => {
      const isPassed = row.score >= kkm ? 'Tuntas' : 'Belum Tuntas';
      const durationStr = this.formatDuration(row.durationSeconds);
      const dateStr = new Date(row.createdAt).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      return [
        (index + 1).toString(),
        `"${row.studentName.replace(/"/g, '""')}"`,
        row.attendanceNumber.toString(),
        row.score.toString(),
        row.correctCount.toString(),
        row.totalQuestions.toString(),
        `"${durationStr}"`,
        `"${isPassed}"`,
        `"${dateStr}"`,
      ].join(';'); // Gunakan semicolon ';' agar otomatis terbaca kolom rapi di Excel regional Indonesia
    });

    // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel mengenali aksen & teks dengan benar
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    a.download = `DIGESTA_Rekap_Nilai_Kuis_${timestamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Format detik menjadi format waktu MM:SS
   */
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
};
