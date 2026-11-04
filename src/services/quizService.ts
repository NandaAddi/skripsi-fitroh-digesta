/**
 * Quiz & Leaderboard Service - Supabase Realtime Architecture
 * 
 * Mengelola penyimpanan percobaan kuis, kalkulasi durasi pengerjaan,
 * serta sinkronisasi papan peringkat (leaderboard) secara real-time via Supabase.
 * Dilengkapi fallback lokal otomatis saat offline / backend belum terhubung.
 */

import { supabase } from './supabaseClient';

export interface QuizScoreSubmission {
  studentId?: string;
  studentName: string;
  attendanceNumber?: number | null;
  score: number;
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
}

export interface LeaderboardEntry {
  id: string;
  studentId?: string;
  studentName: string;
  attendanceNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
  createdAt: string;
  rank?: number;
}

const LOCAL_SCORES_KEY = 'digesta_quiz_scores_local';

// Data simulasi default bertema edukasi jika database Supabase masih baru/kosong
const DEFAULT_LEADERBOARD_MOCK: LeaderboardEntry[] = [
  {
    id: 'mock-1',
    studentName: 'Aisyah Putri Maharani',
    attendanceNumber: 3,
    score: 100,
    correctCount: 20,
    totalQuestions: 20,
    durationSeconds: 124,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    rank: 1,
  },
  {
    id: 'mock-2',
    studentName: 'Bagas Aditya Pratama',
    attendanceNumber: 7,
    score: 95,
    correctCount: 19,
    totalQuestions: 20,
    durationSeconds: 148,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    rank: 2,
  },
  {
    id: 'mock-3',
    studentName: 'Citra Dewi Kirana',
    attendanceNumber: 11,
    score: 90,
    correctCount: 18,
    totalQuestions: 20,
    durationSeconds: 165,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    rank: 3,
  },
  {
    id: 'mock-4',
    studentName: 'Dimas Fajar Nugroho',
    attendanceNumber: 14,
    score: 85,
    correctCount: 17,
    totalQuestions: 20,
    durationSeconds: 190,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    rank: 4,
  },
  {
    id: 'mock-5',
    studentName: 'Elvira Nurhaliza',
    attendanceNumber: 18,
    score: 80,
    correctCount: 16,
    totalQuestions: 20,
    durationSeconds: 210,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    rank: 5,
  },
];

export const quizService = {
  /**
   * Menyimpan skor hasil kuis siswa ke Supabase (dan fallback localStorage).
   * Selalu menimpa (upsert / overwrite) rekaman kuis sebelumnya dengan percobaan kuis terbaru.
   */
  async submitQuizScore(submission: QuizScoreSubmission): Promise<{ success: boolean; error: string | null }> {
    const studentName = (submission.studentName?.trim() || 'SISWA DIGESTA').toUpperCase();
    const attendanceNumber = submission.attendanceNumber && submission.attendanceNumber > 0
      ? submission.attendanceNumber
      : 1;

    // Simpan di fallback lokal (menimpa rekaman lama jika sudah ada)
    try {
      const existingStr = localStorage.getItem(LOCAL_SCORES_KEY);
      const existing: LeaderboardEntry[] = existingStr ? JSON.parse(existingStr) : [];
      const newEntry: LeaderboardEntry = {
        id: 'local-' + Date.now(),
        studentId: submission.studentId,
        studentName,
        attendanceNumber,
        score: submission.score,
        correctCount: submission.correctCount,
        totalQuestions: submission.totalQuestions,
        durationSeconds: submission.durationSeconds,
        createdAt: new Date().toISOString(),
      };

      const existingIdx = existing.findIndex(
        (item) => item.studentName.toUpperCase() === studentName && item.attendanceNumber === attendanceNumber
      );
      if (existingIdx !== -1) {
        existing[existingIdx] = newEntry;
      } else {
        existing.push(newEntry);
      }
      localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(existing));
    } catch {
      // Abaikan error localStorage
    }

    // Kirim ke Supabase dengan pola UPSERT (menimpa data jika nama & nomor absen sama)
    if (supabase) {
      try {
        // Cek apakah studentId merupakan UUID valid Supabase
        const isUuid = submission.studentId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(submission.studentId);
        
        const payload = {
          student_id: isUuid ? submission.studentId : null,
          student_name: studentName,
          attendance_number: attendanceNumber,
          score: submission.score,
          correct_count: submission.correctCount,
          total_questions: submission.totalQuestions,
          duration_seconds: submission.durationSeconds,
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('quiz_scores')
          .upsert(payload, { onConflict: 'student_name,attendance_number' });

        if (error) {
          console.warn('[DIGESTA Supabase Quiz] Gagal menimpa nilai ke Supabase:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true, error: null };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Koneksi database terputus';
        console.warn('[DIGESTA Supabase Quiz] Pengecualian simpan nilai:', msg);
        return { success: false, error: msg };
      }
    }

    return { success: true, error: null };
  },

  /**
   * Mengambil data papan peringkat dari tabel view `v_leaderboard` Supabase.
   * Mengurutkan berdasarkan skor tertinggi, kemudian durasi tercepat.
   */
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('v_leaderboard')
          .select('*')
          .limit(20);

        if (!error && data && data.length > 0) {
          return data.map((item, index) => ({
            id: item.id || `rank-${index + 1}`,
            studentId: item.student_id,
            studentName: item.student_name,
            attendanceNumber: item.attendance_number,
            score: Number(item.score),
            correctCount: Number(item.correct_count),
            totalQuestions: Number(item.total_questions),
            durationSeconds: Number(item.duration_seconds),
            createdAt: item.created_at,
            rank: index + 1,
          }));
        }
      } catch (err) {
        console.warn('[DIGESTA Supabase Leaderboard] Gagal mengambil leaderboard Supabase:', err);
      }
    }

    // Fallback: Gabungkan data lokal dengan mock
    try {
      const localStr = localStorage.getItem(LOCAL_SCORES_KEY);
      const localEntries: LeaderboardEntry[] = localStr ? JSON.parse(localStr) : [];

      const combined = [...localEntries, ...DEFAULT_LEADERBOARD_MOCK];

      // Ambil skor terbaik per siswa unik (studentName + attendanceNumber)
      const bestMap = new Map<string, LeaderboardEntry>();
      for (const entry of combined) {
        const key = `${entry.studentName.toLowerCase()}_${entry.attendanceNumber}`;
        const existing = bestMap.get(key);
        if (!existing) {
          bestMap.set(key, entry);
        } else if (
          entry.score > existing.score ||
          (entry.score === existing.score && entry.durationSeconds < existing.durationSeconds)
        ) {
          bestMap.set(key, entry);
        }
      }

      const sorted = Array.from(bestMap.values()).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.durationSeconds - b.durationSeconds;
      });

      return sorted.slice(0, 15).map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
    } catch {
      return DEFAULT_LEADERBOARD_MOCK;
    }
  },

  /**
   * Format durasi detik menjadi tampilan MM:SS (misal 85 detik -> "01:25")
   */
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
};
