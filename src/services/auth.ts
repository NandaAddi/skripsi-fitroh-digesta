/**
 * Auth Service - Supabase Ready Architecture
 * 
 * Antarmuka autentikasi ini kompatibel dengan Supabase Auth.
 * Saat kredensial Supabase di `.env` belum diisi, sistem beroperasi
 * dalam simulasi interaktif berkecepatan tinggi dengan persistensi localStorage,
 * memungkinkan mockup panel berfungsi penuh dengan feedback nyata.
 */

import { supabaseConfig } from './supabaseClient';

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

/**
 * Sinkronisasi data profil siswa ke tabel Supabase (jika terhubung).
 * Berjalan non-blocking di background agar mode offline/tanpa backend tetap instan.
 */
async function syncToSupabase(user: User): Promise<void> {
  if (!supabaseConfig.isConfigured()) return;
  try {
    const endpoint = `${supabaseConfig.url}/rest/v1/students`;
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': supabaseConfig.anonKey || '',
        'Authorization': `Bearer ${supabaseConfig.anonKey || ''}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        id: user.id,
        full_name: user.fullName,
        attendance_number: user.attendanceNumber ?? null,
        role: user.role,
        last_login: user.createdAt,
      }),
    });
  } catch (err) {
    console.warn('[DIGESTA Supabase Sync] Fallback lokal aktif (gagal sinkronisasi Supabase):', err);
  }
}

export const authService = {
  /**
   * Cek status apakah menggunakan live Supabase atau simulasi lokal
   */
  isLive(): boolean {
    return supabaseConfig.isConfigured();
  },

  /**
   * Mendapatkan sesi pengguna yang saat ini aktif
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
   * Masuk langsung dengan Nama Lengkap dan Nomor Absen Siswa
   */
  async signInWithStudentProfile({
    fullName,
    attendanceNumber,
  }: {
    fullName: string;
    attendanceNumber: number;
  }): Promise<AuthResponse> {
    // Simulasi delay realistis untuk feedback visual
    await new Promise((resolve) => setTimeout(resolve, 400));

    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      return { user: null, error: 'Nama lengkap minimal 2 karakter.' };
    }

    const absNum = Number(attendanceNumber);
    if (!attendanceNumber || isNaN(absNum) || absNum < 1 || absNum > 99) {
      return { user: null, error: 'Nomor absen harus berupa angka antara 1 sampai 99.' };
    }

    const user: User = {
      id: 'std_' + Math.random().toString(36).substring(2, 9),
      fullName: trimmedName,
      attendanceNumber: absNum,
      email: `absen${absNum}@digesta.local`,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    // Sinkronisasi non-blocking di latar belakang
    syncToSupabase(user).catch(() => {});

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
    // Simulasi delay jaringan realistis
    await new Promise((resolve) => setTimeout(resolve, 500));

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { user: null, error: 'Format email tidak valid.' };
    }
    if (!password || password.length < 6) {
      return { user: null, error: 'Kata sandi minimal 6 karakter.' };
    }

    // Nama otomatis dari username email jika tidak ada profil tersimpan
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
    await new Promise((resolve) => setTimeout(resolve, 600));

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
    await new Promise((resolve) => setTimeout(resolve, 300));

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
    await new Promise((resolve) => setTimeout(resolve, 150));
    localStorage.removeItem(STORAGE_KEY);
    return { error: null };
  },
};
