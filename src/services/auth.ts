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
  email: string;
  fullName: string;
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
