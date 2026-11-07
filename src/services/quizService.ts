/**
 * Quiz & Evaluation Service - DIGESTA Pre-Test & Post-Test Architecture
 * 
 * Mengelola penyimpanan percobaan kuis Pre-Test dan Post-Test siswa,
 * pencegahan pengulangan kuis (kuis terkunci), pengaturan buka/kunci guru,
 * serta kalkulasi durasi pengerjaan dengan integrasi Supabase dan fallback lokal.
 */

import { supabase } from './supabaseClient';

export type TestType = 'pre_test' | 'post_test';

export interface QuizScoreSubmission {
  studentId?: string;
  studentName: string;
  attendanceNumber?: number | null;
  testType: TestType;
  score: number;
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
}

export interface QuizScoreRecord {
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

export interface QuizSettings {
  preTestOpen: boolean;
  postTestOpen: boolean;
}

export interface StudentQuizStatus {
  preTestCompleted: boolean;
  preTestScore: number | null;
  preTestDuration: number | null;
  postTestCompleted: boolean;
  postTestScore: number | null;
  postTestDuration: number | null;
}

const LOCAL_SCORES_KEY = 'digesta_quiz_scores_local';
const LOCAL_SETTINGS_KEY = 'digesta_quiz_settings';

const DEFAULT_SETTINGS: QuizSettings = {
  preTestOpen: true,
  postTestOpen: false,
};

export const quizService = {
  /**
   * Mengambil status pengaturan buka/kunci Pre-Test & Post-Test dari Supabase (atau fallback localStorage)
   */
  async getQuizSettings(): Promise<QuizSettings> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('quiz_settings')
          .select('pre_test_open, post_test_open')
          .eq('id', 'default')
          .maybeSingle();

        if (!error && data) {
          const settings: QuizSettings = {
            preTestOpen: Boolean(data.pre_test_open),
            postTestOpen: Boolean(data.post_test_open),
          };
          // Sinkronkan ke cache lokal
          try {
            localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
          } catch {
            // Abaikan error localStorage
          }
          return settings;
        }
      } catch (err) {
        console.warn('[DIGESTA Quiz] Gagal mengambil quiz_settings dari Supabase:', err);
      }
    }

    // Fallback ke localStorage
    try {
      const cached = localStorage.getItem(LOCAL_SETTINGS_KEY);
      if (cached) {
        return JSON.parse(cached) as QuizSettings;
      }
    } catch {
      // Abaikan error
    }

    return DEFAULT_SETTINGS;
  },

  /**
   * Memperbarui status buka/kunci Pre-Test & Post-Test dari Admin Dashboard
   */
  async updateQuizSettings(settings: QuizSettings): Promise<{ success: boolean; error: string | null }> {
    // Simpan di cache lokal
    try {
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Abaikan
    }

    if (supabase) {
      try {
        const { error } = await supabase
          .from('quiz_settings')
          .upsert({
            id: 'default',
            pre_test_open: settings.preTestOpen,
            post_test_open: settings.postTestOpen,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.warn('[DIGESTA Quiz] Gagal memperbarui quiz_settings di Supabase:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true, error: null };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Koneksi database gagal';
        return { success: false, error: msg };
      }
    }

    return { success: true, error: null };
  },

  /**
   * Menyimpan skor hasil kuis (Pre-Test atau Post-Test) siswa ke Supabase & localStorage.
   * Setiap siswa hanya memiliki 1 catatan per tipe tes (Pre-Test / Post-Test).
   */
  async submitQuizScore(submission: QuizScoreSubmission): Promise<{ success: boolean; error: string | null }> {
    const studentName = (submission.studentName?.trim() || 'SISWA DIGESTA').toUpperCase();
    const attendanceNumber = submission.attendanceNumber && submission.attendanceNumber > 0
      ? submission.attendanceNumber
      : 1;
    const testType = submission.testType || 'pre_test';

    // 1. Simpan di fallback lokal
    try {
      const existingStr = localStorage.getItem(LOCAL_SCORES_KEY);
      const existing: QuizScoreRecord[] = existingStr ? JSON.parse(existingStr) : [];
      const newEntry: QuizScoreRecord = {
        id: 'local-' + Date.now(),
        studentId: submission.studentId,
        studentName,
        attendanceNumber,
        testType,
        score: submission.score,
        correctCount: submission.correctCount,
        totalQuestions: submission.totalQuestions,
        durationSeconds: submission.durationSeconds,
        createdAt: new Date().toISOString(),
      };

      const existingIdx = existing.findIndex(
        (item) =>
          item.studentName.toUpperCase() === studentName &&
          item.attendanceNumber === attendanceNumber &&
          item.testType === testType
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

    // 2. Kirim ke Supabase dengan UPSERT berbasis (student_name, attendance_number, test_type)
    if (supabase) {
      try {
        const isUuid = submission.studentId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(submission.studentId);
        
        const payload = {
          student_id: isUuid ? submission.studentId : null,
          student_name: studentName,
          attendance_number: attendanceNumber,
          test_type: testType,
          score: submission.score,
          correct_count: submission.correctCount,
          total_questions: submission.totalQuestions,
          duration_seconds: submission.durationSeconds,
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('quiz_scores')
          .upsert(payload, { onConflict: 'student_name,attendance_number,test_type' });

        if (error) {
          console.warn('[DIGESTA Supabase Quiz] Gagal menyimpan nilai kuis:', error.message);
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
   * Memeriksa status penyelesaian kuis Pre-Test dan Post-Test untuk siswa tertentu
   */
  async getStudentQuizStatus(studentName: string, attendanceNumber?: number | null): Promise<StudentQuizStatus> {
    const cleanName = (studentName?.trim() || '').toUpperCase();
    const cleanAttendance = attendanceNumber && attendanceNumber > 0 ? attendanceNumber : null;

    let preScore: number | null = null;
    let preDuration: number | null = null;
    let postScore: number | null = null;
    let postDuration: number | null = null;

    // Coba ambil dari Supabase
    if (supabase && cleanName) {
      try {
        let query = supabase
          .from('quiz_scores')
          .select('test_type, score, duration_seconds')
          .eq('student_name', cleanName);

        if (cleanAttendance !== null) {
          query = query.eq('attendance_number', cleanAttendance);
        }

        const { data, error } = await query;
        if (!error && data) {
          for (const item of data) {
            if (item.test_type === 'pre_test') {
              preScore = Number(item.score);
              preDuration = Number(item.duration_seconds);
            } else if (item.test_type === 'post_test') {
              postScore = Number(item.score);
              postDuration = Number(item.duration_seconds);
            }
          }

          if (preScore !== null || postScore !== null) {
            return {
              preTestCompleted: preScore !== null,
              preTestScore: preScore,
              preTestDuration: preDuration,
              postTestCompleted: postScore !== null,
              postTestScore: postScore,
              postTestDuration: postDuration,
            };
          }
        }
      } catch (err) {
        console.warn('[DIGESTA Quiz] Gagal cek status siswa di Supabase:', err);
      }
    }

    // Fallback cek di localStorage
    try {
      const localStr = localStorage.getItem(LOCAL_SCORES_KEY);
      if (localStr) {
        const records: QuizScoreRecord[] = JSON.parse(localStr);
        for (const item of records) {
          const matchName = item.studentName.toUpperCase() === cleanName;
          const matchAttendance = cleanAttendance === null || item.attendanceNumber === cleanAttendance;
          if (matchName && matchAttendance) {
            if (item.testType === 'pre_test') {
              preScore = item.score;
              preDuration = item.durationSeconds;
            } else if (item.testType === 'post_test') {
              postScore = item.score;
              postDuration = item.durationSeconds;
            }
          }
        }
      }
    } catch {
      // Abaikan error
    }

    return {
      preTestCompleted: preScore !== null,
      preTestScore: preScore,
      preTestDuration: preDuration,
      postTestCompleted: postScore !== null,
      postTestScore: postScore,
      postTestDuration: postDuration,
    };
  },

  /**
   * Format durasi detik menjadi format waktu MM:SS (misal 85 detik -> "01:25")
   */
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
};
