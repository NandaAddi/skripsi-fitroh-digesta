/**
 * DIGESTA - Admin & Teacher Management Service
 * 
 * Mengelola autentikasi sesi Guru/Admin (PIN), rekapitulasi evaluasi Pre-Test & Post-Test,
 * perbandingan peningkatan hasil belajar (Gain), penghapusan data, dan ekspor CSV/Excel.
 */

import { supabase } from './supabaseClient';
import type { TestType } from './quizService';

export interface RawQuizScoreRow {
  id: string;
  studentId?: string;
  studentName: string;
  attendanceNumber: number;
  testType: TestType;
  score: number;
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
  createdAt: string;
}

export interface StudentEvaluationRow {
  studentKey: string;
  studentName: string;
  attendanceNumber: number;
  preTestId?: string;
  preTestScore: number | null;
  preTestDuration: number | null;
  preTestDate?: string;
  postTestId?: string;
  postTestScore: number | null;
  postTestDuration: number | null;
  postTestDate?: string;
  gain: number | null; // Nilai Post-Test - Pre-Test
  lastDate: string;
}

export interface ClassStatistics {
  totalStudents: number;
  avgPreScore: number;
  avgPostScore: number;
  avgGain: number;
  highestScore: number;
  lowestScore: number;
  passedCount: number;
  failedCount: number;
  passingRate: number; // Persentase kelulusan KKM Post-Test (0-100%)
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
   * Mengambil seluruh rekaman mentah nilai kuis dari Supabase (atau fallback lokal)
   */
  async getRawScores(): Promise<RawQuizScoreRow[]> {
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
            testType: (item.test_type as TestType) || 'post_test',
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
        const parsed: RawQuizScoreRow[] = JSON.parse(localStr);
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
   * Menggabungkan rekaman nilai siswa menjadi 1 Baris per Siswa
   * bersanding antara Pre-Test dan Post-Test dengan kalkulasi Peningkatan Nilai (Gain).
   */
  async getStudentEvaluations(): Promise<StudentEvaluationRow[]> {
    const rawList = await this.getRawScores();
    const studentMap = new Map<string, StudentEvaluationRow>();

    for (const item of rawList) {
      const studentKey = `${item.studentName.toUpperCase()}_${item.attendanceNumber}`;
      let row = studentMap.get(studentKey);

      if (!row) {
        row = {
          studentKey,
          studentName: item.studentName,
          attendanceNumber: item.attendanceNumber,
          preTestScore: null,
          preTestDuration: null,
          postTestScore: null,
          postTestDuration: null,
          gain: null,
          lastDate: item.createdAt,
        };
        studentMap.set(studentKey, row);
      }

      if (item.testType === 'pre_test') {
        row.preTestId = item.id;
        row.preTestScore = item.score;
        row.preTestDuration = item.durationSeconds;
        row.preTestDate = item.createdAt;
      } else {
        row.postTestId = item.id;
        row.postTestScore = item.score;
        row.postTestDuration = item.durationSeconds;
        row.postTestDate = item.createdAt;
      }

      // Hitung selisih peningkatan nilai jika keduanya ada
      if (row.postTestScore !== null && row.preTestScore !== null) {
        row.gain = row.postTestScore - row.preTestScore;
      }

      // Update tanggal terbaru
      if (new Date(item.createdAt) > new Date(row.lastDate)) {
        row.lastDate = item.createdAt;
      }
    }

    // Urutkan berdasarkan nomor absen siswa (1, 2, 3...)
    return Array.from(studentMap.values()).sort(
      (a, b) => a.attendanceNumber - b.attendanceNumber
    );
  },

  /**
   * Menghapus seluruh rekaman nilai (Pre-Test & Post-Test) seorang siswa
   */
  async deleteStudentScores(studentName: string, attendanceNumber: number): Promise<{ success: boolean; error: string | null }> {
    const cleanName = studentName.trim().toUpperCase();

    // Hapus dari localStorage
    try {
      const localStr = localStorage.getItem(LOCAL_SCORES_KEY);
      if (localStr) {
        const parsed: RawQuizScoreRow[] = JSON.parse(localStr);
        const filtered = parsed.filter(
          (item) => !(item.studentName.toUpperCase() === cleanName && item.attendanceNumber === attendanceNumber)
        );
        localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(filtered));
      }
    } catch {
      // Abaikan
    }

    // Hapus dari Supabase jika terhubung
    if (supabase) {
      try {
        const { error } = await supabase
          .from('quiz_scores')
          .delete()
          .eq('student_name', cleanName)
          .eq('attendance_number', attendanceNumber);

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
   * Menghitung ringkasan statistik kelas evaluasi belajar
   */
  computeStatistics(rows: StudentEvaluationRow[], kkm = 75): ClassStatistics {
    if (rows.length === 0) {
      return {
        totalStudents: 0,
        avgPreScore: 0,
        avgPostScore: 0,
        avgGain: 0,
        highestScore: 0,
        lowestScore: 0,
        passedCount: 0,
        failedCount: 0,
        passingRate: 0,
      };
    }

    const preScores = rows.map((r) => r.preTestScore).filter((s): s is number => s !== null);
    const postScores = rows.map((r) => r.postTestScore).filter((s): s is number => s !== null);
    const gains = rows.map((r) => r.gain).filter((g): g is number => g !== null);

    const avgPre = preScores.length > 0 ? Math.round(preScores.reduce((a, b) => a + b, 0) / preScores.length) : 0;
    const avgPost = postScores.length > 0 ? Math.round(postScores.reduce((a, b) => a + b, 0) / postScores.length) : 0;
    const avgGain = gains.length > 0 ? Math.round((gains.reduce((a, b) => a + b, 0) / gains.length) * 10) / 10 : 0;

    const allScores = [...preScores, ...postScores];
    const maxScore = allScores.length > 0 ? Math.max(...allScores) : 0;
    const minScore = allScores.length > 0 ? Math.min(...allScores) : 0;

    // Kelulusan dihitung berdasarkan Post-Test
    const passed = postScores.filter((s) => s >= kkm).length;
    const failed = postScores.length - passed;
    const passingRate = postScores.length > 0 ? Math.round((passed / postScores.length) * 100) : 0;

    return {
      totalStudents: rows.length,
      avgPreScore: avgPre,
      avgPostScore: avgPost,
      avgGain,
      highestScore: maxScore,
      lowestScore: minScore,
      passedCount: passed,
      failedCount: failed,
      passingRate,
    };
  },

  /**
   * Mengekspor rekaman nilai siswa ke berkas CSV yang kompatibel langsung dengan Microsoft Excel
   */
  exportScoresToCsv(rows: StudentEvaluationRow[], kkm = 75): void {
    if (rows.length === 0) return;

    // Header CSV
    const headers = [
      'No',
      'Nomor Absen',
      'Nama Siswa',
      'Nilai Pre-Test',
      'Durasi Pre-Test',
      'Nilai Post-Test',
      'Durasi Post-Test',
      'Peningkatan Nilai (Gain)',
      'Status KKM Post-Test (>= ' + kkm + ')',
      'Tanggal Terakhir',
    ];

    const csvRows = rows.map((row, index) => {
      const preStr = row.preTestScore !== null ? `${row.preTestScore}` : '-';
      const preDurStr = row.preTestDuration !== null ? this.formatDuration(row.preTestDuration) : '-';
      const postStr = row.postTestScore !== null ? `${row.postTestScore}` : '-';
      const postDurStr = row.postTestDuration !== null ? this.formatDuration(row.postTestDuration) : '-';
      const gainStr = row.gain !== null ? (row.gain > 0 ? `+${row.gain}` : `${row.gain}`) : '-';
      const isPassed = row.postTestScore !== null
        ? row.postTestScore >= kkm
          ? 'Tuntas'
          : 'Belum Tuntas'
        : 'Belum Mengerjakan';
      const dateStr = new Date(row.lastDate).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      return [
        (index + 1).toString(),
        row.attendanceNumber.toString(),
        `"${row.studentName.replace(/"/g, '""')}"`,
        `"${preStr}"`,
        `"${preDurStr}"`,
        `"${postStr}"`,
        `"${postDurStr}"`,
        `"${gainStr}"`,
        `"${isPassed}"`,
        `"${dateStr}"`,
      ].join(';');
    });

    // Tambahkan UTF-8 BOM (\uFEFF)
    const csvContent = '\uFEFF' + [headers.join(';'), ...csvRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    a.download = `DIGESTA_Rekapitulasi_Pre_Post_Test_${timestamp}.csv`;
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
