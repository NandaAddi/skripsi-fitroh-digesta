import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/petunjuk-penggunaan-screen/bg-petunjuk-penggunaan.webp';
import btnHome from '../../assets/petunjuk-penggunaan-screen/button-home.webp';
import btnSetting from '../../assets/petunjuk-penggunaan-screen/button-setting.webp';
import btnLeft from '../../assets/petunjuk-penggunaan-screen/button-left.webp';
import btnRight from '../../assets/petunjuk-penggunaan-screen/button-right.webp';
import btnExit from '../../assets/menu-screen/button-exit.webp';
import slide1 from '../../assets/petunjuk-penggunaan-screen/konten-slide-1.webp';
import { useAuth } from '../../context/AuthContext';
import { playSound as playSoundEffect } from '../../services/soundService';
import './MenuPetunjukScreen.css';

interface PetunjukSlide {
  id: number;
  title: string;
}

const SLIDES: PetunjukSlide[] = [
  { id: 1, title: 'Informasi Media & Software Pendukung' },
  { id: 2, title: 'Petunjuk Penggunaan Tombol Navigasi' },
];

export const MenuPetunjukScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Efek suara interaktif terpusat Web Audio API
  const playSound = (type: 'pop' | 'chime' | 'soft') => {
    playSoundEffect(type, soundEnabled);
  };

  const handlePrev = () => {
    playSound('pop');
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  };

  const handleNext = () => {
    playSound('pop');
    setCurrentSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  };

  const handleGoHome = () => {
    playSound('pop');
    navigate('/menu');
  };

  const toggleFullscreen = () => {
    playSound('pop');
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Navigasi keyboard tombol panah kiri/kanan & ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSettings) {
        if (e.key === 'Escape') setShowSettings(false);
        return;
      }
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        navigate('/menu');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings, navigate]);

  return (
    <div className="petunjuk-viewport">
      <div className="petunjuk-stage" ref={stageRef}>
        {/* Layer 1: Background Ruang Kerja, Card Putih & Badge Judul */}
        <img
          src={bgImg}
          alt="Latar Belakang Petunjuk Penggunaan DIGESTA"
          className="petunjuk-bg"
          draggable={false}
        />

        {/* Layer 2: Konten Slide */}
        <div className="petunjuk-content-container">
          {/* Slide 1: Informasi Media & Software Pendukung (Asset Canva) */}
          <div className={`petunjuk-slide-pane ${currentSlide === 0 ? 'active' : ''}`}>
            <img
              src={slide1}
              alt={SLIDES[0].title}
              className="petunjuk-slide-img"
              draggable={false}
            />
          </div>

          {/* Slide 2: Petunjuk Interaktif Tombol Aplikasi (Game Aesthetic) */}
          <div className={`petunjuk-slide-pane ${currentSlide === 1 ? 'active' : ''}`}>
            <div className="petunjuk-slide-interactive">
              <div className="petunjuk-slide2-header">
                <h2 className="petunjuk-slide2-title">Fungsi Tombol Antarmuka</h2>
                <p className="petunjuk-slide2-subtitle">
                  Kenali fungsi tombol navigasi untuk mempermudah pengalaman belajarmu di aplikasi DIGESTA
                </p>
              </div>

              <div className="petunjuk-button-list">
                {/* Baris 1: Tombol Pengaturan */}
                <div className="petunjuk-list-item petunjuk-item-setting">
                  <div className="petunjuk-item-icon-wrapper">
                    <img
                      src={btnSetting}
                      alt="Tombol Pengaturan"
                      className="petunjuk-item-icon"
                      draggable={false}
                    />
                  </div>
                  <div className="petunjuk-item-content">
                    <div className="petunjuk-item-title">Tombol Pengaturan</div>
                    <div className="petunjuk-item-desc">
                      Mengatur efek suara tombol, beralih ke mode layar penuh, dan memeriksa status akun siswa.
                    </div>
                  </div>
                  <div className="petunjuk-item-badge petunjuk-badge-setting">
                    Pojok Kiri Atas
                  </div>
                </div>

                {/* Baris 2: Tombol Beranda */}
                <div className="petunjuk-list-item petunjuk-item-home">
                  <div className="petunjuk-item-icon-wrapper">
                    <img
                      src={btnHome}
                      alt="Tombol Beranda"
                      className="petunjuk-item-icon"
                      draggable={false}
                    />
                  </div>
                  <div className="petunjuk-item-content">
                    <div className="petunjuk-item-title">Tombol Beranda</div>
                    <div className="petunjuk-item-desc">
                      Navigasi cepat untuk langsung kembali ke panggung Menu Utama dari modul pembelajaran mana pun.
                    </div>
                  </div>
                  <div className="petunjuk-item-badge petunjuk-badge-home">
                    Pojok Kanan Atas
                  </div>
                </div>

                {/* Baris 3: Tombol Panah Navigasi */}
                <div className="petunjuk-list-item petunjuk-item-arrow">
                  <div className="petunjuk-item-icon-wrapper petunjuk-icon-pair">
                    <img
                      src={btnLeft}
                      alt="Panah Kiri"
                      className="petunjuk-pair-img"
                      draggable={false}
                    />
                    <img
                      src={btnRight}
                      alt="Panah Kanan"
                      className="petunjuk-pair-img"
                      draggable={false}
                    />
                  </div>
                  <div className="petunjuk-item-content">
                    <div className="petunjuk-item-title">Tombol Panah Navigasi</div>
                    <div className="petunjuk-item-desc">
                      Berpindah maju atau mundur antar slide materi, petunjuk, dan alur penjelasan proses organ.
                    </div>
                  </div>
                  <div className="petunjuk-item-badge petunjuk-badge-arrow">
                    Tombol [←] [→]
                  </div>
                </div>

                {/* Baris 4: Tombol Keluar */}
                <div className="petunjuk-list-item petunjuk-item-exit">
                  <div className="petunjuk-item-icon-wrapper">
                    <img
                      src={btnExit}
                      alt="Tombol Keluar"
                      className="petunjuk-item-icon"
                      draggable={false}
                    />
                  </div>
                  <div className="petunjuk-item-content">
                    <div className="petunjuk-item-title">Tombol Keluar</div>
                    <div className="petunjuk-item-desc">
                      Membuka jendela dialog konfirmasi untuk mengakhiri sesi belajar dan keluar dari akun.
                    </div>
                  </div>
                  <div className="petunjuk-item-badge petunjuk-badge-exit">
                    Pojok Kanan Atas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 3: Tombol Aksi di Pojok Atas (Settings & Home) */}
        <button
          type="button"
          className="petunjuk-btn-setting"
          onClick={() => {
            playSound('pop');
            setShowSettings(true);
          }}
          title="Pengaturan"
          aria-label="Pengaturan"
        >
          <img
            src={btnSetting}
            alt="Pengaturan"
            className="petunjuk-btn-img"
            draggable={false}
          />
        </button>

        <button
          type="button"
          className="petunjuk-btn-home"
          onClick={handleGoHome}
          title="Kembali ke Menu Utama"
          aria-label="Kembali ke Menu Utama"
        >
          <img
            src={btnHome}
            alt="Menu Utama"
            className="petunjuk-btn-img"
            draggable={false}
          />
        </button>

        {/* Layer 4: Tombol Navigasi Slide di Sudut Bawah (Kiri & Kanan) */}
        <button
          type="button"
          className="petunjuk-btn-left"
          onClick={handlePrev}
          title="Slide Sebelumnya"
          aria-label="Slide Sebelumnya"
        >
          <img
            src={btnLeft}
            alt="Sebelumnya"
            className="petunjuk-btn-img"
            draggable={false}
          />
        </button>

        <button
          type="button"
          className="petunjuk-btn-right"
          onClick={handleNext}
          title="Slide Selanjutnya"
          aria-label="Slide Selanjutnya"
        >
          <img
            src={btnRight}
            alt="Selanjutnya"
            className="petunjuk-btn-img"
            draggable={false}
          />
        </button>

        {/* Indikator Titik Slide */}
        <div className="petunjuk-dots">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              className={`petunjuk-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => {
                playSound('soft');
                setCurrentSlide(idx);
              }}
              title={`Buka Slide ${slide.id}: ${slide.title}`}
              aria-label={`Slide ${slide.id}: ${slide.title}`}
            />
          ))}
        </div>

        {/* Modal Pengaturan (Settings Dialog Bertema Game) */}
        {showSettings && (
          <div className="petunjuk-modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="petunjuk-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="petunjuk-modal-header">
                <h3 className="petunjuk-modal-title">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0ca653"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Pengaturan Petunjuk</span>
                </h3>
                <button
                  type="button"
                  className="petunjuk-modal-btn-x"
                  onClick={() => setShowSettings(false)}
                  aria-label="Tutup Dialog"
                >
                  ✕
                </button>
              </div>

              <div className="petunjuk-modal-row">
                <div>
                  <div className="petunjuk-modal-label">Efek Suara Audio</div>
                  <div className="petunjuk-modal-sub">Bunyi saat menekan tombol navigasi</div>
                </div>
                <button
                  type="button"
                  className={`petunjuk-switch ${soundEnabled ? 'active' : ''}`}
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) playSound('pop');
                  }}
                >
                  {soundEnabled ? 'AKTIF' : 'MATI'}
                </button>
              </div>

              <div className="petunjuk-modal-row">
                <div>
                  <div className="petunjuk-modal-label">Mode Layar Penuh</div>
                  <div className="petunjuk-modal-sub">Tampilan maksimal tanpa gangguan</div>
                </div>
                <button
                  type="button"
                  className="petunjuk-switch"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? 'Keluar' : 'Layar Penuh'}
                </button>
              </div>

              {user && (
                <div className="petunjuk-modal-row">
                  <div>
                    <div className="petunjuk-modal-label">Pengguna Aktif</div>
                    <div className="petunjuk-modal-sub">
                      {user.attendanceNumber
                        ? `No. Absen: ${user.attendanceNumber}`
                        : user.role === 'guest'
                          ? 'Siswa Tamu (Tanpa Absen)'
                          : user.email || 'Siswa DIGESTA'}
                    </div>
                  </div>
                  <span className="petunjuk-user-tag">
                    {user.fullName}
                  </span>
                </div>
              )}

              <button
                type="button"
                className="petunjuk-modal-btn-close"
                onClick={() => {
                  playSound('soft');
                  setShowSettings(false);
                }}
              >
                Tutup Pengaturan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPetunjukScreen;
