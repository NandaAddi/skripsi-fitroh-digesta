/**
 * Supabase Client Configuration & Readiness Check
 * 
 * File ini mengelola koneksi ke database & auth Supabase.
 * Konfigurasi diambil dari environment variables (.env / .env.local):
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 * 
 * Saat kredensial belum diisi atau offline, DIGESTA berjalan dalam mode simulasi
 * interaktif dan fallback localStorage yang aman tanpa error.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const supabaseConfig = {
  url: (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim(),
  anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim(),
  
  /**
   * Mengecek apakah kredensial Supabase sudah terkonfigurasi secara valid
   */
  isConfigured(): boolean {
    return Boolean(
      this.url &&
      this.anonKey &&
      this.url.startsWith('https://') &&
      !this.url.includes('your-project-id') &&
      this.anonKey.length > 20
    );
  },
};

/**
 * Instance Supabase Client tunggal (Singleton)
 * Bernilai null jika environment variables belum dikonfigurasi.
 */
export const supabase: SupabaseClient | null = supabaseConfig.isConfigured()
  ? createClient(supabaseConfig.url!, supabaseConfig.anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
