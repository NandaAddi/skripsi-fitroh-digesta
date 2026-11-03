import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playSound as playSoundEffect } from '../../services/soundService';

// Background & Tombol Navigasi
import bgClassroom from '../../assets/menu-materi-gangguan-pencernaan-screen/bg-menu-materi-gangguan-pencernaan-screen.webp';
import btnBackMateri from '../../assets/menu-materi-proses-pencernaan/button-back-menu-materi.webp';
import btnHome from '../../assets/menu-materi-proses-pencernaan/button-home.webp';
import btnNext from '../../assets/menu-materi-proses-pencernaan/button-next.webp';
import btnMekanik from '../../assets/menu-materi-proses-pencernaan/button-mekanik.webp';
import btnKimiawi from '../../assets/menu-materi-proses-pencernaan/button-kimiawi.webp';

// Slide Gambar Teroptimasi WebP
import slide1Intro from '../../assets/menu-materi-proses-pencernaan/slide-1.webp';
import slide2Choice from '../../assets/menu-materi-proses-pencernaan/slide-2.webp';

import slide1Mekanik from '../../assets/menu-materi-proses-pencernaan/slide-1-mekanik.webp';
import slide2Mekanik from '../../assets/menu-materi-proses-pencernaan/slide-2-mekanik.webp';
import slide3Mekanik from '../../assets/menu-materi-proses-pencernaan/slide-3-mekanik.webp';
import slide5Mekanik from '../../assets/menu-materi-proses-pencernaan/slide-5-mekanik.webp';
import slide6Mekanik from '../../assets/menu-materi-proses-pencernaan/slide-6-mekanik.webp';

import slide1Kimiawi from '../../assets/menu-materi-proses-pencernaan/slide-1-kimiawi.webp';
import slide2Kimiawi from '../../assets/menu-materi-proses-pencernaan/slide-2-kimiawi.webp';
import slide3Kimiawi from '../../assets/menu-materi-proses-pencernaan/slide-3-kimiawi.webp';
import slide4Kimiawi from '../../assets/menu-materi-proses-pencernaan/slide-4-kimiawi.webp';
import slide5Kimiawi from '../../assets/menu-materi-proses-pencernaan/slide-5-kimiawi.webp';

// Video Animasi Proses Pencernaan
import videoMekanik from '../../assets/menu-materi-proses-pencernaan/video-mekanik.mp4';
import videoKimiawi from '../../assets/menu-materi-proses-pencernaan/video-kimiawi.mp4';
import { OrganVideoPlayer } from '../MenuMateriOrganIsiScreen/OrganVideoPlayer';

import './MenuMateriProsesScreen.css';

type ProsesBranch = 'intro' | 'choice' | 'mekanik' | 'kimiawi';

const MEKANIK_SLIDES = [
  { id: 1, img: slide1Mekanik, title: 'Pertanyaan Pemantik Mekanik' },
  { id: 2, img: slide2Mekanik, title: 'Definisi Pencernaan Mekanik' },
  { id: 3, img: slide3Mekanik, title: 'Lokasi Pencernaan Mekanik' },
  { id: 4, img: slide5Mekanik, title: 'Video Animasi Pencernaan Mekanik', isVideo: true, videoSrc: videoMekanik },
  { id: 5, img: slide6Mekanik, title: 'Lanjut ke Pencernaan Kimiawi' },
];

const KIMIAWI_SLIDES = [
  { id: 1, img: slide1Kimiawi, title: 'Pertanyaan Pemantik Kimiawi' },
  { id: 2, img: slide2Kimiawi, title: 'Definisi Pencernaan Kimiawi' },
  { id: 3, img: slide3Kimiawi, title: 'Lokasi & Enzim Pencernaan Kimiawi' },
  { id: 4, img: slide4Kimiawi, title: 'Video Animasi Pencernaan Kimiawi', isVideo: true, videoSrc: videoKimiawi },
  { id: 5, img: slide5Kimiawi, title: 'Lanjut ke Pencernaan Mekanik' },
];

export const MenuMateriProsesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [branch, setBranch] = useState<ProsesBranch>('intro');
  const [subSlide, setSubSlide] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Sintesis audio interaktif Web Audio API terpusat & aman
  const playSound = useCallback(
    (type: 'pop' | 'chime' | 'soft') => {
      playSoundEffect(type, soundEnabled);
    },
    [soundEnabled]
  );

  const handleNext = useCallback(() => {
    playSound('pop');
    if (branch === 'intro') {
      setBranch('choice');
      setSubSlide(0);
    } else if (branch === 'mekanik') {
      if (subSlide < MEKANIK_SLIDES.length - 1) {
        setSubSlide((prev) => prev + 1);
      } else {
        // Dari akhir mekanik langsung beralih ke cabang kimiawi
        playSound('chime');
        setBranch('kimiawi');
        setSubSlide(0);
      }
    } else if (branch === 'kimiawi') {
      if (subSlide < KIMIAWI_SLIDES.length - 1) {
        setSubSlide((prev) => prev + 1);
      } else {
        // Dari akhir kimiawi langsung beralih ke cabang mekanik
        playSound('chime');
        setBranch('mekanik');
        setSubSlide(0);
      }
    }
  }, [branch, subSlide, playSound]);

  const handlePrev = useCallback(() => {
    playSound('pop');
    if (branch === 'mekanik') {
      if (subSlide > 0) {
        setSubSlide((prev) => prev - 1);
      } else {
        setBranch('choice');
      }
    } else if (branch === 'kimiawi') {
      if (subSlide > 0) {
        setSubSlide((prev) => prev - 1);
      } else {
        setBranch('choice');
      }
    } else if (branch === 'choice') {
      setBranch('intro');
      setSubSlide(0);
    }
  }, [branch, subSlide, playSound]);

  const handleSelectBranch = (selectedBranch: 'mekanik' | 'kimiawi') => {
    playSound('chime');
    setBranch(selectedBranch);
    setSubSlide(0);
  };

  const handleBackToMateri = useCallback(() => {
    playSound('pop');
    navigate('/menu/materi');
  }, [playSound, navigate]);

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

  // Kontrol Navigasi Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        if (branch !== 'choice') {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (branch !== 'intro') {
          e.preventDefault();
          handlePrev();
        }
      } else if (e.key === 'Escape') {
        handleBackToMateri();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [branch, handleNext, handlePrev, handleBackToMateri]);

  // Label Pelacak Progress
  const getTrackerLabel = () => {
    if (branch === 'intro') return 'Pengantar';
    if (branch === 'choice') return 'Pilih Proses';
    if (branch === 'mekanik') return `Mekanik ${subSlide + 1} / ${MEKANIK_SLIDES.length}`;
    if (branch === 'kimiawi') return `Kimiawi ${subSlide + 1} / ${KIMIAWI_SLIDES.length}`;
    return '';
  };

  return (
    <div className="proses-pencernaan-viewport">
      {/* 16:9 Aspect Ratio Locked Stage */}
      <div className="proses-pencernaan-stage" ref={stageRef}>
        {/* Layer 1: Background Ruang Kelas Bersih */}
        <img
          src={bgClassroom}
          alt="Latar Belakang Ruang Kelas DIGESTA"
          className="proses-pencernaan-bg"
          draggable={false}
        />

        {/* Layer 2: Seluruh Slide Konten Transparan */}
        <div className="proses-content-container">
          {/* Slide 1 Intro */}
          <img
            src={slide1Intro}
            alt="Pengantar Proses Pencernaan"
            className={`proses-slide-img ${branch === 'intro' ? 'active' : ''}`}
            draggable={false}
          />

          {/* Slide 2 Menu Pilihan (Mekanik / Kimiawi) */}
          <img
            src={slide2Choice}
            alt="Pilihan Proses Pencernaan"
            className={`proses-slide-img ${branch === 'choice' ? 'active' : ''}`}
            draggable={false}
          />

          {/* Cabang Mekanik */}
          {MEKANIK_SLIDES.map((s, idx) => (
            <img
              key={`mekanik-${s.id}`}
              src={s.img}
              alt={s.title}
              className={`proses-slide-img ${branch === 'mekanik' && subSlide === idx ? 'active' : ''}`}
              draggable={false}
            />
          ))}

          {/* Cabang Kimiawi */}
          {KIMIAWI_SLIDES.map((s, idx) => (
            <img
              key={`kimiawi-${s.id}`}
              src={s.img}
              alt={s.title}
              className={`proses-slide-img ${branch === 'kimiawi' && subSlide === idx ? 'active' : ''}`}
              draggable={false}
            />
          ))}
        </div>

        {/* Layer 2.5: Video Player Interaktif pada Slide Video Mekanik */}
        {branch === 'mekanik' && MEKANIK_SLIDES[subSlide]?.isVideo && MEKANIK_SLIDES[subSlide]?.videoSrc && (
          <div className="proses-video-player-container">
            <OrganVideoPlayer
              key={`video-mekanik-${subSlide}`}
              src={MEKANIK_SLIDES[subSlide].videoSrc!}
              title="Pencernaan Mekanik"
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {/* Layer 2.5: Video Player Interaktif pada Slide Video Kimiawi */}
        {branch === 'kimiawi' && KIMIAWI_SLIDES[subSlide]?.isVideo && KIMIAWI_SLIDES[subSlide]?.videoSrc && (
          <div className="proses-video-player-container">
            <OrganVideoPlayer
              key={`video-kimiawi-${subSlide}`}
              src={KIMIAWI_SLIDES[subSlide].videoSrc!}
              title="Pencernaan Kimiawi"
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {/* Layer 3: Top Bar Navigasi & Informasi */}
        <div className="proses-topbar">
          <div className="proses-topbar-left">
            <button
              type="button"
              className="proses-corner-btn"
              onClick={handleBackToMateri}
              title="Kembali ke Daftar Materi"
              aria-label="Kembali ke Daftar Materi"
            >
              <img src={btnBackMateri} alt="Kembali ke Materi" />
            </button>

            <span className="proses-badge-tracker">{getTrackerLabel()}</span>
          </div>

          <div className="proses-topbar-right">
            {user && (
              <span className="proses-user-tag">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {user.fullName} {user.attendanceNumber ? `(#${user.attendanceNumber})` : ''}
              </span>
            )}

            <button
              type="button"
              className="proses-util-btn"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playSound('pop');
              }}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              aria-label="Toggle Suara"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            <button
              type="button"
              className="proses-util-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? '✕' : '⛶'}
            </button>

            <button
              type="button"
              className="proses-corner-btn"
              onClick={handleGoHome}
              title="Kembali ke Menu Utama"
              aria-label="Menu Utama"
            >
              <img src={btnHome} alt="Menu Utama" />
            </button>
          </div>
        </div>

        {/* Layer 4: Kontrol Interaktif pada Balon Dialog */}

        {/* Dua Tombol Pilihan pada Slide 2 */}
        {branch === 'choice' && (
          <div className="proses-choice-container">
            <button
              type="button"
              className="proses-choice-btn"
              onClick={() => handleSelectBranch('mekanik')}
              onMouseEnter={() => playSound('soft')}
              title="Pelajari Pencernaan Mekanik"
              aria-label="Pencernaan Mekanik"
            >
              <img src={btnMekanik} alt="Mekanik" />
            </button>

            <button
              type="button"
              className="proses-choice-btn"
              onClick={() => handleSelectBranch('kimiawi')}
              onMouseEnter={() => playSound('soft')}
              title="Pelajari Pencernaan Kimiawi"
              aria-label="Pencernaan Kimiawi"
            >
              <img src={btnKimiawi} alt="Kimiawi" />
            </button>
          </div>
        )}

        {/* Tombol Tunggal Pindah Topik di Space Kanan pada Slide Penutup */}
        {branch === 'mekanik' && subSlide === MEKANIK_SLIDES.length - 1 && (
          <button
            type="button"
            className="proses-btn-switch-topic"
            onClick={() => handleSelectBranch('kimiawi')}
            onMouseEnter={() => playSound('soft')}
            title="Lanjut Pelajari Pencernaan Kimiawi"
            aria-label="Pencernaan Kimiawi"
          >
            <img src={btnKimiawi} alt="Kimiawi" />
          </button>
        )}

        {branch === 'kimiawi' && subSlide === KIMIAWI_SLIDES.length - 1 && (
          <button
            type="button"
            className="proses-btn-switch-topic"
            onClick={() => handleSelectBranch('mekanik')}
            onMouseEnter={() => playSound('soft')}
            title="Lanjut Pelajari Pencernaan Mekanik"
            aria-label="Pencernaan Mekanik"
          >
            <img src={btnMekanik} alt="Mekanik" />
          </button>
        )}

        {/* Tombol Next Bundar Biru di Pojok Kanan Bawah Balon Dialog (Hanya pada slide reguler) */}
        {branch !== 'choice' &&
          !(branch === 'mekanik' && subSlide === MEKANIK_SLIDES.length - 1) &&
          !(branch === 'kimiawi' && subSlide === KIMIAWI_SLIDES.length - 1) && (
            <button
              type="button"
              className="proses-btn-next"
              onClick={handleNext}
              title="Lanjut"
              aria-label="Lanjut"
            >
              <img src={btnNext} alt="Tombol Lanjut" />
            </button>
          )}
      </div>
    </div>
  );
};

export default MenuMateriProsesScreen;
