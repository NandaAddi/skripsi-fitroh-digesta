/**
 * Auth Service - Supabase Ready Architecture
 * 
 * Antarmuka autentikasi ini terintegrasi langsung dengan Supabase Database & Auth.
 * Saat kredensial Supabase di `.env` belum diisi atau perangkat offline,
 * sistem secara mulus beroperasi dalam fallback lokal instan dengan persistensi
 * localStorage, memungkinkan seluruh fitur tetap berjalan tanpa hambatan.
 */

import { supabase, supabaseConfig } from './supabaseClient';

export interface User {
  id: string;
  fullName: string;
  attendanceNumber?: number | null;
  email?: string;
  role: 'student' | 'teacher' | 'guest';
  createdAt: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

const STORAGE_KEY = 'digesta_auth_session';

export const authService = {
  /**
   * Cek status apakah menggunakan live Supabase atau simulasi lokal
   */
  isLive(): boolean {
    return supabaseConfig.isConfigured() && Boolean(supabase);
  },

  /**
   * Mendapatkan sesi pengguna yang saat ini aktif dari localStorage
   */
  getCurrentUser(): User | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  /**
   * Masuk langsung dengan Nama Lengkap dan Nomor Absen Siswa.
   * Terhubung langsung ke tabel `students` di Supabase untuk pendaftaran/sinkronisasi instan.
   */
  async signInWithStudentProfile({
    fullName,
    attendanceNumber,
  }: {
    fullName: string;
    attendanceNumber: number;
  }): Promise<AuthResponse> {
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      return { user: null, error: 'Nama lengkap minimal 2 karakter.' };
    }

    const absNum = Number(attendanceNumber);
    if (!attendanceNumber || isNaN(absNum) || absNum < 1 || absNum > 99) {
      return { user: null, error: 'Nomor absen harus berupa angka antara 1 sampai 99.' };
    }

    // Jika Supabase aktif, lakukan upsert profil siswa di tabel `students`
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .upsert(
            {
              full_name: trimmedName,
              attendance_number: absNum,
              role: 'student',
              last_login: new Date().toISOString(),
            },
            { onConflict: 'full_name,attendance_number' }
          )
          .select('id, full_name, attendance_number, role, created_at')
          .single();

        if (!error && data) {
          const user: User = {
            id: data.id,
            fullName: data.full_name,
            attendanceNumber: data.attendance_number,
            email: `absen${data.attendance_number}@digesta.local`,
            role: (data.role as 'student' | 'teacher' | 'guest') || 'student',
            createdAt: data.created_at || new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          return { user, error: null };
        } else if (error) {
          console.warn('[DIGESTA Supabase Auth] Upsert siswa gagal, menggunakan fallback lokal:', error.message);
        }
      } catch (err) {
        console.warn('[DIGESTA Supabase Auth] Pengecualian koneksi Supabase:', err);
      }
    }

    // Fallback lokal jika belum ada koneksi Supabase / offline
    await new Promise((resolve) => setTimeout(resolve, 350));
    const user: User = {
      id: 'std_' + Math.random().toString(36).substring(2, 9),
      fullName: trimmedName,
      attendanceNumber: absNum,
      email: `absen${absNum}@digesta.local`,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { user, error: null };
  },

  /**
   * Masuk dengan Email dan Password (kompatibel dengan Supabase Auth signInWithPassword)
   */
  async signInWithPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { user: null, error: 'Format email tidak valid.' };
    }
    if (!password || password.length < 6) {
      return { user: null, error: 'Kata sandi minimal 6 karakter.' };
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          return { user: null, error: error.message };
        }

        if (data.user) {
          const fullName =
            data.user.user_metadata?.full_name ||
            trimmedEmail.split('@')[0].replace(/[._-]/g, ' ');
          const user: User = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            fullName,
            role: 'student',
            createdAt: data.user.created_at || new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          return { user, error: null };
        }
      } catch (err) {
        console.warn('[DIGESTA Supabase Auth] Login email gagal, fallback lokal:', err);
      }
    }

    // Fallback simulasi
    await new Promise((resolve) => setTimeout(resolve, 400));
    const cleanName = trimmedEmail
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: trimmedEmail,
      fullName: cleanName,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { user, error: null };
  },

  /**
   * Pendaftaran akun baru (kompatibel dengan Supabase Auth signUp)
   */
  async signUp({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<AuthResponse> {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      return { user: null, error: 'Nama lengkap minimal 2 karakter.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { user: null, error: 'Format email tidak valid.' };
    }
    if (!password || password.length < 6) {
      return { user: null, error: 'Kata sandi minimal 6 karakter.' };
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: trimmedName,
            },
          },
        });

        if (error) {
          return { user: null, error: error.message };
        }

        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            fullName: trimmedName,
            role: 'student',
            createdAt: data.user.created_at || new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          return { user, error: null };
        }
      } catch (err) {
        console.warn('[DIGESTA Supabase Auth] SignUp gagal, fallback lokal:', err);
      }
    }

    // Fallback simulasi
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: trimmedEmail,
      fullName: trimmedName,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { user, error: null };
  },

  /**
   * Masuk instan sebagai Tamu (Guest Mode)
   * Sangat berguna untuk pengujian, demonstrasi, atau siswa tanpa akun
   */
  async signInAsGuest(guestName?: string): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const name = guestName?.trim() || 'Siswa Tamu DIGESTA';
    const user: User = {
      id: 'guest_' + Math.random().toString(36).substring(2, 8),
      email: 'tamu@digesta.edu',
      fullName: name,
      attendanceNumber: null,
      role: 'guest',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { user, error: null };
  },

  /**
   * Keluar dari sesi (kompatibel dengan Supabase signOut)
   */
  async signOut(): Promise<{ error: string | null }> {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[DIGESTA Supabase Auth] SignOut exception:', err);
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    return { error: null };
  },
};
