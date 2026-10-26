import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/pangantar-screen/bg-pengantar-screen.webp';
import btnHome from '../../assets/pangantar-screen/button-home.webp';
import btnSetting from '../../assets/pangantar-screen/button-setting.webp';
import btnLeft from '../../assets/pangantar-screen/button-left.webp';
import btnRight from '../../assets/pangantar-screen/button-right.webp';
import slide1 from '../../assets/pangantar-screen/konten-slide-1.webp';
import slide2 from '../../assets/pangantar-screen/konten-slide-2.webp';
import slide3 from '../../assets/pangantar-screen/konten-slide-3.webp';
import { useAuth } from '../../context/AuthContext';
import './MenuPengantarScreen.css';

const SLIDES = [
  { id: 1, title: 'Biodata & Pengantar Pengembang', img: slide1 },
  { id: 2, title: 'Tujuan Pembelajaran', img: slide2 },
  { id: 3, title: 'Capaian Pembelajaran', img: slide3 },
];

export const MenuPengantarScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Sintesis audio interaktif Web Audio API
  const playSound = (type: 'pop' | 'chime' | 'soft') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'chime') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(540, ctx.currentTime);
        osc1.frequency.setValueAtTime(820, ctx.currentTime + 0.08);
        gain1.gain.setValueAtTime(0.25, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.25);
      } else if (type === 'soft') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      // AudioContext policy fallback
    }
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
    <div className="pengantar-viewport">
      <div className="pengantar-stage" ref={stageRef}>
        {/* Layer 1: Background Ruang Belajar & Card Putih */}
        <img
          src={bgImg}
          alt="Latar Belakang Pengantar DIGESTA"
          className="pengantar-bg"
          draggable={false}
        />

        {/* Layer 2: Konten Slide Transparan */}
        <div className="pengantar-content-container">
          {SLIDES.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.img}
              alt={slide.title}
              className={`pengantar-slide-img ${idx === currentSlide ? 'active' : ''}`}
              draggable={false}
            />
          ))}
        </div>

        {/* Layer 3: Tombol Aksi di Pojok (Settings & Home) */}
        <button
          type="button"
          className="pengantar-btn-setting"
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
            className="pengantar-btn-img"
            draggable={false}
          />
        </button>

        <button
          type="button"
          className="pengantar-btn-home"
          onClick={handleGoHome}
          title="Kembali ke Menu Utama"
          aria-label="Kembali ke Menu Utama"
        >
          <img
            src={btnHome}
            alt="Menu Utama"
            className="pengantar-btn-img"
            draggable={false}
          />
        </button>

        {/* Layer 4: Tombol Navigasi Slide (Kiri & Kanan) */}
        <button
          type="button"
          className="pengantar-btn-left"
          onClick={handlePrev}
          title="Slide Sebelumnya"
          aria-label="Slide Sebelumnya"
        >
          <img
            src={btnLeft}
            alt="Sebelumnya"
            className="pengantar-btn-img"
            draggable={false}
          />
        </button>

        <button
          type="button"
          className="pengantar-btn-right"
          onClick={handleNext}
          title="Slide Selanjutnya"
          aria-label="Slide Selanjutnya"
        >
          <img
            src={btnRight}
            alt="Selanjutnya"
            className="pengantar-btn-img"
            draggable={false}
          />
        </button>

        {/* Indikator Slide Bulat */}
        <div className="pengantar-dots">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`pengantar-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => {
                playSound('soft');
                setCurrentSlide(idx);
              }}
              title={`Buka Slide ${idx + 1}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Modal Pengaturan (Settings) */}
        {showSettings && (
          <div className="pengantar-modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="pengantar-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="pengantar-modal-header">
                <h3 className="pengantar-modal-title">
                  <span>⚙️</span>
                  <span>Pengaturan Pengantar</span>
                </h3>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: '#868e96',
                  }}
                  onClick={() => setShowSettings(false)}
                >
                  ✕
                </button>
              </div>

              <div className="pengantar-modal-row">
                <div>
                  <div className="pengantar-modal-label">Efek Suara Audio</div>
                  <div className="pengantar-modal-sub">Bunyi saat menekan tombol navigasi</div>
                </div>
                <button
                  type="button"
                  className={`pengantar-switch ${soundEnabled ? 'active' : ''}`}
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) playSound('pop');
                  }}
                >
                  {soundEnabled ? 'AKTIF' : 'MATI'}
                </button>
              </div>

              <div className="pengantar-modal-row">
                <div>
                  <div className="pengantar-modal-label">Mode Layar Penuh</div>
                  <div className="pengantar-modal-sub">Tampilan penuh tanpa gangguan</div>
                </div>
                <button
                  type="button"
                  className="pengantar-switch"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? 'Keluar' : 'Layar Penuh'}
                </button>
              </div>

              {user && (
                <div className="pengantar-modal-row">
                  <div>
                    <div className="pengantar-modal-label">Pengguna Aktif</div>
                    <div className="pengantar-modal-sub">
                      {user.attendanceNumber
                        ? `No. Absen: ${user.attendanceNumber}`
                        : user.role === 'guest'
                          ? 'Siswa Tamu (Tanpa Absen)'
                          : user.email || 'Siswa DIGESTA'}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#1971c2', fontSize: '0.85rem' }}>
                    {user.fullName}
                  </span>
                </div>
              )}

              <button
                type="button"
                className="pengantar-modal-btn-close"
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

export default MenuPengantarScreen;
