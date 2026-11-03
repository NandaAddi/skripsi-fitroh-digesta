/**
 * Manifest Aset Game & Sistem Preloading DIGESTA
 * Menyediakan daftar seluruh aset penting untuk diprefetch ke memori browser
 * sebelum panggung utama ditampilkan kepada pengguna.
 */

// Start Screen Assets
import startBg from '../assets/start-screen/bg-startscreen.webp';
import startAsset from '../assets/start-screen/asset-startscreen.webp';
import startBtn from '../assets/start-screen/button-startscreen.webp';
import teacherMotion from '../assets/teacher-motion/teacher-motion.webp';

// Menu Screen Assets
import menuBg from '../assets/menu-screen/bg-menuscreen.webp';
import menuLogo from '../assets/menu-screen/logo-menuscreen.webp';
import digestaLogo from '../assets/logo-digiesta.webp';
import logoAnimation from '../assets/logo-animation/logo-animation.webp';
import btnMateri from '../assets/menu-screen/button-materi.webp';
import btnPengantar from '../assets/menu-screen/button-pengantar.webp';
import btnSimulasi from '../assets/menu-screen/button-simulasi.webp';
import btn3D from '../assets/menu-screen/button-3d-dimensi.webp';
import btnKuis from '../assets/menu-screen/button-kuis.webp';
import btnPetunjuk from '../assets/menu-screen/button-petunjuk.webp';
import btnSettings from '../assets/menu-screen/button-settings.webp';
import btnExit from '../assets/menu-screen/button-exit.webp';

// Login Screen Assets
import loginBg from '../assets/login-screen/bg-loginscreen.webp';
import loginAsset from '../assets/login-screen/assets-loginscreen.webp';

// Pengantar Screen Assets
import pengantarBg from '../assets/pangantar-screen/bg-pengantar-screen.webp';
import pengantarSlide1 from '../assets/pangantar-screen/konten-slide-1.webp';
import pengantarSlide2 from '../assets/pangantar-screen/konten-slide-2.webp';
import pengantarSlide3 from '../assets/pangantar-screen/konten-slide-3.webp';
import pengantarBtnLeft from '../assets/pangantar-screen/button-left.webp';
import pengantarBtnRight from '../assets/pangantar-screen/button-right.webp';
import pengantarBtnHome from '../assets/pangantar-screen/button-home.webp';
import pengantarBtnSetting from '../assets/pangantar-screen/button-setting.webp';

// Menu Materi Assets
import menuMateriBg from '../assets/menu-materi-screen/bg-menu-materi.webp';
import btnProsesPencernaan from '../assets/menu-materi-screen/buton-proses-pencernaan.webp';
import btnOrganPencernaan from '../assets/menu-materi-screen/button-organ-pencernaan.webp';
import btnGangguanPencernaan from '../assets/menu-materi-screen/button-gangguan-pencernaan.webp';

// Gangguan Pencernaan Screen Assets
import gangguanBg from '../assets/menu-materi-gangguan-pencernaan-screen/bg-menu-materi-gangguan-pencernaan-screen.webp';
import gangguanBtnHome from '../assets/menu-materi-gangguan-pencernaan-screen/button-home.webp';
import gangguanBtnRight from '../assets/menu-materi-gangguan-pencernaan-screen/button-right.webp';
import gangguanBtnSetting from '../assets/menu-materi-gangguan-pencernaan-screen/button-setting.webp';
import gastritisImg from '../assets/menu-materi-gangguan-pencernaan-screen/gastritis.webp';

// Proses Pencernaan Screen Assets
import btnBackMateri from '../assets/menu-materi-proses-pencernaan/button-back-menu-materi.webp';
import btnNextProses from '../assets/menu-materi-proses-pencernaan/button-next.webp';
import btnMekanik from '../assets/menu-materi-proses-pencernaan/button-mekanik.webp';
import btnKimiawi from '../assets/menu-materi-proses-pencernaan/button-kimiawi.webp';
import slide1Intro from '../assets/menu-materi-proses-pencernaan/slide-1.webp';
import slide2Choice from '../assets/menu-materi-proses-pencernaan/slide-2.webp';

import bgOrganPencernaan from '../assets/menu-materi-organ-pencernaan/bg-materi-organ-pencernaan.webp';
import bgClassroomOrgan from '../assets/menu-materi-organ-pencernaan/isi/bg-isi-materi-organ-pencernaan.webp';
import btnNextOrgan from '../assets/menu-materi-organ-pencernaan/isi/button-next.webp';
import btnMulut from '../assets/menu-materi-organ-pencernaan/button-mulut.webp';
import btnKerongkongan from '../assets/menu-materi-organ-pencernaan/button-kerongkongan.webp';
import btnLambung from '../assets/menu-materi-organ-pencernaan/button-lambung.webp';
import btnUsusHalus from '../assets/menu-materi-organ-pencernaan/button-usus-halus.webp';
import btnUsusBesar from '../assets/menu-materi-organ-pencernaan/button-usus-besar.webp';

export interface PreloadItem {
  url: string;
  label: string;
}

export const ASSETS_TO_PRELOAD: PreloadItem[] = [
  // Prioritas 1: Aset Pembuka & Animasi Guru (Aset Terbesar)
  { url: teacherMotion, label: 'Karakter Animasi Guru HD' },
  { url: startBg, label: 'Latar Belakang Panggung' },
  { url: startAsset, label: 'Papan Judul & Karakter Utama' },
  { url: startBtn, label: 'Tombol Start Interaktif' },

  // Prioritas 2: Menu Utama & Navigasi
  { url: logoAnimation, label: 'Animasi Logo DIGESTA' },
  { url: menuLogo, label: 'Latar Ilustrasi Menu DIGESTA' },
  { url: digestaLogo, label: 'Logo Resmi DIGESTA' },
  { url: menuBg, label: 'Latar Belakang Menu' },
  { url: btnMateri, label: 'Modul Tombol Materi' },
  { url: btnPengantar, label: 'Modul Tombol Pengantar' },
  { url: btnSimulasi, label: 'Modul Tombol Simulasi' },
  { url: btn3D, label: 'Modul Tombol 3D Organ' },
  { url: btnKuis, label: 'Modul Tombol Kuis' },
  { url: btnPetunjuk, label: 'Modul Tombol Petunjuk' },
  { url: btnSettings, label: 'Modul Tombol Pengaturan' },
  { url: btnExit, label: 'Modul Tombol Keluar' },

  // Prioritas 3: Layar Masuk (Login)
  { url: loginBg, label: 'Latar Belakang Autentikasi' },
  { url: loginAsset, label: 'Kartu Masuk Siswa' },

  // Prioritas 4: Materi Pengantar & Slide Pembelajaran
  { url: pengantarBg, label: 'Latar Pengantar Materi' },
  { url: pengantarSlide1, label: 'Media Infografis Slide 1' },
  { url: pengantarSlide2, label: 'Media Infografis Slide 2' },
  { url: pengantarSlide3, label: 'Media Infografis Slide 3' },
  { url: pengantarBtnLeft, label: 'Tombol Navigasi Kiri' },
  { url: pengantarBtnRight, label: 'Tombol Navigasi Kanan' },
  { url: pengantarBtnHome, label: 'Tombol Kembali Beranda' },
  { url: pengantarBtnSetting, label: 'Tombol Opsi Cepat' },

  // Prioritas 5: Menu Materi & Topik Gangguan
  { url: menuMateriBg, label: 'Latar Menu Materi Pokok' },
  { url: btnProsesPencernaan, label: 'Tombol Proses Pencernaan' },
  { url: btnOrganPencernaan, label: 'Tombol Organ Pencernaan' },
  { url: btnGangguanPencernaan, label: 'Tombol Gangguan Pencernaan' },
  { url: gangguanBg, label: 'Latar Ruang Kelas Gangguan' },
  { url: gangguanBtnHome, label: 'Navigasi Menu Gangguan' },
  { url: gangguanBtnRight, label: 'Tombol Aksi Gangguan' },
  { url: gangguanBtnSetting, label: 'Pengaturan Suara Gangguan' },
  { url: gastritisImg, label: 'Infografis Materi Gastritis' },

  // Prioritas 6: Materi Proses Pencernaan
  { url: slide1Intro, label: 'Pengantar Proses Pencernaan' },
  { url: slide2Choice, label: 'Menu Pilihan Proses Pencernaan' },
  { url: btnBackMateri, label: 'Tombol Kembali Materi' },
  { url: btnNextProses, label: 'Tombol Lanjut Balon Dialog' },
  { url: btnMekanik, label: 'Tombol Pilihan Mekanik' },
  { url: btnKimiawi, label: 'Tombol Pilihan Kimiawi' },

  // Prioritas 7: Materi Organ Pencernaan
  { url: bgOrganPencernaan, label: 'Latar Materi Organ Pencernaan' },
  { url: bgClassroomOrgan, label: 'Latar Ruang Kelas Organ Pencernaan' },
  { url: btnNextOrgan, label: 'Tombol Lanjut Organ Pencernaan' },
  { url: btnMulut, label: 'Tombol Organ Mulut' },
  { url: btnKerongkongan, label: 'Tombol Organ Kerongkongan' },
  { url: btnLambung, label: 'Tombol Organ Lambung' },
  { url: btnUsusHalus, label: 'Tombol Organ Usus Halus' },
  { url: btnUsusBesar, label: 'Tombol Organ Usus Besar' },
];

export const BIOLOGY_TRIVIA = [
  'Lambung memproduksi Asam Klorida (HCl) berkekuatan tinggi yang dapat melarutkan makanan dan membunuh bakteri patogen!',
  'Panjang usus halus manusia dewasa mencapai 6 hingga 7 meter dengan jutaan vili untuk menyerap nutrisi!',
  'Enzim amilase (ptialin) di air liur langsung mengubah zat tepung (karbohidrat) menjadi maltosa sejak kunyahan pertama.',
  'Gerak peristaltik adalah kontraksi otot bergelombang yang mendorong makanan dari kerongkongan hingga ke lambung.',
  'Hati adalah organ internal terbesar dalam tubuh kita yang bertugas memproduksi cairan empedu untuk memecah lemak.',
  'Usus besar menyerap kembali air dan elektrolit dari sisa makanan sehingga tubuh kita tidak mengalami dehidrasi.',
];

/**
 * Memuat gambar secara asinkron ke memori browser cache
 */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    if (img.complete) {
      resolve();
      return;
    }
    img.onload = () => resolve();
    img.onerror = () => {
      // Tetap selesaikan jika ada kendala jaringan per berkas agar tidak memblokir aplikasi
      resolve();
    };
  });
}

/**
 * Eksekusi preloading seluruh aset secara paralel dengan batas maksimal waktu aman (safety timeout)
 */
export async function preloadAllAssets(
  onProgress: (loaded: number, total: number, label: string) => void
): Promise<void> {
  const total = ASSETS_TO_PRELOAD.length + 1; // +1 untuk Font
  let loaded = 0;

  // 1. Tunggu Font selesai dimuat
  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
  } catch {
    // Abaikan jika browser tidak mendukung Font API
  }
  loaded += 1;
  onProgress(loaded, total, 'Memuat Tipografi & Font Game...');

  // 2. Preload seluruh aset gambar WebP secara paralel
  const promises = ASSETS_TO_PRELOAD.map(async (item) => {
    await preloadImage(item.url);
    loaded += 1;
    onProgress(loaded, total, item.label);
  });

  // 3. Batas waktu keamanan (Safety Timeout 12 detik)
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(resolve, 12000);
  });

  await Promise.race([Promise.all(promises), timeoutPromise]);
}
