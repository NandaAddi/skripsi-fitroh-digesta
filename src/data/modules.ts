import btnPengantar from '../assets/menu-screen/button-pengantar.webp';
import btnMateri from '../assets/menu-screen/button-materi.webp';
import btnPetunjuk from '../assets/menu-screen/button-petunjuk.webp';
import btn3dDimensi from '../assets/menu-screen/button-3d-dimensi.webp';
import btnKuis from '../assets/menu-screen/button-kuis.webp';

export type MenuKey = 'pengantar' | 'materi' | '3d' | 'petunjuk' | 'kuis';

export interface MenuItem {
  id: MenuKey;
  title: string;
  badge: string;
  img: string;
  color: string;
  description: string;
  features: string[];
  icon: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'pengantar',
    title: 'Pengantar Sistem Pencernaan',
    badge: 'Modul 1',
    img: btnPengantar,
    color: '#a61e2b',
    icon: '📖',
    description: 'Pengenalan komprehensif mengenai saluran gastrointestinal manusia, fungsi utama sistem pencernaan, serta pentingnya nutrisi bagi tubuh.',
    features: ['Pengenalan Organ Pencernaan', 'Fungsi & Peran Saluran Cerna', 'Video Animasi Pengantar'],
  },
  {
    id: 'materi',
    title: 'Materi Pembelajaran Lengkap',
    badge: 'Modul 2',
    img: btnMateri,
    color: '#e89e1a',
    icon: '🔬',
    description: 'Pelajari proses pencernaan tahap demi tahap: mulai dari rongga mulut, esofagus, lambung, usus halus, usus besar, hingga proses penyerapan nutrisi.',
    features: ['Pencernaan Mekanik & Kimiawi', 'Enzim-Enzim Pencernaan', 'Struktur Jaringan Organ'],
  },
  {
    id: '3d',
    title: 'Model Anatomi 3 Dimensi',
    badge: 'Modul 3',
    img: btn3dDimensi,
    color: '#d61ca8',
    icon: '🧊',
    description: 'Visualisasi 3D anatomi sistem pencernaan beresolusi tinggi. Putar, zoom, dan telaah tiap organ pencernaan dari berbagai sudut pandang.',
    features: ['Rotasi Bebas 360 Derajat', 'Zoom Detail Anatomi', 'Label Hotspot Interaktif'],
  },
  {
    id: 'petunjuk',
    title: 'Petunjuk Penggunaan DIGESTA',
    badge: 'Panduan',
    img: btnPetunjuk,
    color: '#0ca653',
    icon: '🧭',
    description: 'Panduan navigasi praktis bagi siswa dan guru dalam memanfaatkan seluruh fitur pembelajaran interaktif yang ada di dalam DIGESTA.',
    features: ['Cara Menjalankan Pembelajaran', 'Navigasi Menu & Hotspot', 'Tips Penggunaan di Kelas'],
  },
  {
    id: 'kuis',
    title: 'Kuis & Evaluasi Pemahaman',
    badge: 'Evaluasi',
    img: btnKuis,
    color: '#0071db',
    icon: '🎯',
    description: 'Uji pemahamanmu tentang sistem pencernaan lewat tantangan kuis bergambar, tebak organ, dan evaluasi hasil belajar interaktif!',
    features: ['Kuis Pilihan Ganda & Analisis Kasus', 'Papan Skor Interaktif', 'Pembahasan Langsung'],
  },
];
