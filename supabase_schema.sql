-- ============================================================================
-- DIGESTA (Digital Interactive Gastrointestinal Education System)
-- Supabase Database Schema & Setup Script
-- Sistem Evaluasi Pembelajaran: Pre-Test & Post-Test Terkunci (Tanpa Leaderboard)
-- ============================================================================

-- 1. Tabel Siswa (students)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  attendance_number INTEGER NOT NULL CHECK (attendance_number >= 1 AND attendance_number <= 99),
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_student_profile UNIQUE (full_name, attendance_number)
);

-- Indeks pencarian siswa
CREATE INDEX IF NOT EXISTS idx_students_lookup 
  ON public.students (full_name, attendance_number);

-- 2. Tabel Nilai & Percobaan Kuis (quiz_scores)
CREATE TABLE IF NOT EXISTS public.quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  attendance_number INTEGER NOT NULL,
  test_type VARCHAR(20) NOT NULL DEFAULT 'post_test', -- 'pre_test' atau 'post_test'
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  correct_count INTEGER NOT NULL CHECK (correct_count >= 0 AND correct_count <= total_questions),
  total_questions INTEGER NOT NULL DEFAULT 20,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_quiz_score_student_test UNIQUE (student_name, attendance_number, test_type)
);

-- Pastikan kolom test_type ada jika tabel sudah ada sebelumnya
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_scores' AND column_name = 'test_type'
  ) THEN
    ALTER TABLE public.quiz_scores ADD COLUMN test_type VARCHAR(20) NOT NULL DEFAULT 'post_test';
  END IF;
END $$;

-- Update constraint pada tabel yang sudah ada sebelumnya
ALTER TABLE public.quiz_scores 
  DROP CONSTRAINT IF EXISTS unique_quiz_score_student;
ALTER TABLE public.quiz_scores 
  DROP CONSTRAINT IF EXISTS unique_quiz_score_student_test;

ALTER TABLE public.quiz_scores 
  ADD CONSTRAINT unique_quiz_score_student_test UNIQUE (student_name, attendance_number, test_type);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_student_fk 
  ON public.quiz_scores (student_id);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_lookup
  ON public.quiz_scores (student_name, attendance_number, test_type);

-- 3. Tabel Pengaturan Buka/Kunci Kuis Guru (quiz_settings)
CREATE TABLE IF NOT EXISTS public.quiz_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  pre_test_open BOOLEAN NOT NULL DEFAULT true,
  post_test_open BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Masukkan pengaturan awal jika belum ada (Pre-Test dibuka, Post-Test ditutup default)
INSERT INTO public.quiz_settings (id, pre_test_open, post_test_open)
VALUES ('default', true, false)
ON CONFLICT (id) DO NOTHING;

-- 4. Konfigurasi Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;

-- Kebijakan untuk tabel students
DROP POLICY IF EXISTS "Public can view students" ON public.students;
CREATE POLICY "Public can view students"
  ON public.students FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can insert students" ON public.students;
CREATE POLICY "Public can insert students"
  ON public.students FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update student last_login" ON public.students;
CREATE POLICY "Public can update student last_login"
  ON public.students FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete students" ON public.students;
CREATE POLICY "Public can delete students"
  ON public.students FOR DELETE
  TO anon, authenticated
  USING (true);

-- Kebijakan untuk tabel quiz_scores
DROP POLICY IF EXISTS "Public can view quiz scores" ON public.quiz_scores;
CREATE POLICY "Public can view quiz scores"
  ON public.quiz_scores FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can submit quiz scores" ON public.quiz_scores;
CREATE POLICY "Public can submit quiz scores"
  ON public.quiz_scores FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update quiz scores" ON public.quiz_scores;
CREATE POLICY "Public can update quiz scores"
  ON public.quiz_scores FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete quiz scores" ON public.quiz_scores;
CREATE POLICY "Public can delete quiz scores"
  ON public.quiz_scores FOR DELETE
  TO anon, authenticated
  USING (true);

-- Kebijakan untuk tabel quiz_settings
DROP POLICY IF EXISTS "Public can view quiz settings" ON public.quiz_settings;
CREATE POLICY "Public can view quiz settings"
  ON public.quiz_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can update quiz settings" ON public.quiz_settings;
CREATE POLICY "Public can update quiz settings"
  ON public.quiz_settings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert quiz settings" ON public.quiz_settings;
CREATE POLICY "Public can insert quiz settings"
  ON public.quiz_settings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
