-- ============================================================================
-- DIGESTA (Digital Interactive Gastrointestinal Education System)
-- Supabase Database Schema & Setup Script
--
-- CARA PENGGUNAAN:
-- 1. Buka dashboard proyek Supabase Anda (https://supabase.com/dashboard)
-- 2. Pilih menu "SQL Editor" di bilah navigasi kiri.
-- 3. Klik "New query", salin (copy) dan tempel (paste) seluruh skrip ini,
--    lalu klik tombol "Run" (atau Ctrl+Enter).
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
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  correct_count INTEGER NOT NULL CHECK (correct_count >= 0 AND correct_count <= total_questions),
  total_questions INTEGER NOT NULL DEFAULT 20,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_quiz_score_student UNIQUE (student_name, attendance_number)
);

-- Pembersihan duplikasi lama (hanya menyisakan 1 rekaman kuis terbaru per siswa)
DELETE FROM public.quiz_scores
WHERE id NOT IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY lower(student_name), attendance_number 
      ORDER BY created_at DESC
    ) as rn
    FROM public.quiz_scores
  ) t WHERE t.rn = 1
);

-- Pastikan unique constraint aktif pada tabel yang sudah dibuat sebelumnya
ALTER TABLE public.quiz_scores 
  DROP CONSTRAINT IF EXISTS unique_quiz_score_student;

ALTER TABLE public.quiz_scores 
  ADD CONSTRAINT unique_quiz_score_student UNIQUE (student_name, attendance_number);

-- Indeks pemeringkatan leaderboard (Skor tertinggi & durasi tercepat)
CREATE INDEX IF NOT EXISTS idx_quiz_scores_ranking 
  ON public.quiz_scores (score DESC, duration_seconds ASC, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_student_fk 
  ON public.quiz_scores (student_id);

-- 3. View Papan Peringkat Terbaik (v_leaderboard)
-- Mengambil 1 nilai terbaik per siswa unik (tie-breaker durasi tercepat)
CREATE OR REPLACE VIEW public.v_leaderboard AS
WITH ranked_attempts AS (
  SELECT
    id,
    student_id,
    student_name,
    attendance_number,
    score,
    correct_count,
    total_questions,
    duration_seconds,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY student_name, attendance_number
      ORDER BY score DESC, duration_seconds ASC, created_at ASC
    ) AS rank_order
  FROM public.quiz_scores
)
SELECT
  id,
  student_id,
  student_name,
  attendance_number,
  score,
  correct_count,
  total_questions,
  duration_seconds,
  created_at
FROM ranked_attempts
WHERE rank_order = 1
ORDER BY score DESC, duration_seconds ASC, created_at ASC;

-- 4. Konfigurasi Row Level Security (RLS)
-- Mengizinkan siswa/aplikasi membaca dan menyimpan data secara anonim publik (Anon Key)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Public can delete students" ON public.students;
CREATE POLICY "Public can delete students"
  ON public.students FOR DELETE
  TO anon, authenticated
  USING (true);
