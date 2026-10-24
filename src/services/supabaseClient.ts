/**
 * Supabase Client Configuration & Readiness Check
 * 
 * File ini mengelola koneksi ke database & auth Supabase.
 * Konfigurasi diambil dari environment variables (.env / .env.local):
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 * 
 * Saat kredensial belum diisi, DIGESTA berjalan dalam mode simulasi interaktif
 * yang aman dan dapat dicoba langsung tanpa backend.
 */

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  
  /**
   * Mengecek apakah kredensial Supabase sudah terkonfigurasi
   */
  isConfigured(): boolean {
    return Boolean(
      this.url &&
      this.anonKey &&
      this.url.startsWith('https://') &&
      !this.url.includes('your-project-id')
    );
  },
};
