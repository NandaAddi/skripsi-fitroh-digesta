import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { playSound as playSoundEffect } from '../../services/soundService';

// Background & Tombol Navigasi WebP
import bgClassroom from '../../assets/menu-materi-organ-pencernaan/isi/bg-isi-materi-organ-pencernaan.webp';
import btnBackMateri from '../../assets/menu-materi-organ-pencernaan/button-back-menu-materi.webp';
import btnHome from '../../assets/menu-materi-organ-pencernaan/button-home.webp';
import btnNext from '../../assets/menu-materi-organ-pencernaan/isi/button-next.webp';

// Tombol 5 Organ Pencernaan WebP
import btnMulut from '../../assets/menu-materi-organ-pencernaan/button-mulut.webp';
import btnKerongkongan from '../../assets/menu-materi-organ-pencernaan/button-kerongkongan.webp';
import btnLambung from '../../assets/menu-materi-organ-pencernaan/button-lambung.webp';
import btnUsusHalus from '../../assets/menu-materi-organ-pencernaan/button-usus-halus.webp';
import btnUsusBesar from '../../assets/menu-materi-organ-pencernaan/button-usus-besar.webp';

// Slide Mulut (4 slides)
import slide1Mulut from '../../assets/menu-materi-organ-pencernaan/isi/slide1-organ-mulut.webp';
import slide2Mulut from '../../assets/menu-materi-organ-pencernaan/isi/slide2-organ-mulut.webp';
import slide3Mulut from '../../assets/menu-materi-organ-pencernaan/isi/slide3-organ-mulut.webp';
import slide4Mulut from '../../assets/menu-materi-organ-pencernaan/isi/slide4-organ-mulut.webp';

// Slide Kerongkongan (4 slides)
import slide1Kerongkongan from '../../assets/menu-materi-organ-pencernaan/isi/slide1-kerongkongan.webp';
import slide2Kerongkongan from '../../assets/menu-materi-organ-pencernaan/isi/slide2-kerongkongan.webp';
import slide3Kerongkongan from '../../assets/menu-materi-organ-pencernaan/isi/slide3-kerongkongan.webp';
import slide4Kerongkongan from '../../assets/menu-materi-organ-pencernaan/isi/slide4-kerongkongan.webp';

// Slide Lambung (5 slides)
import slide1Lambung from '../../assets/menu-materi-organ-pencernaan/isi/slide1-lambung.webp';
import slide2Lambung from '../../assets/menu-materi-organ-pencernaan/isi/slide2-lambung.webp';
import slide3Lambung from '../../assets/menu-materi-organ-pencernaan/isi/slide3-lambung.webp';
import slide4Lambung from '../../assets/menu-materi-organ-pencernaan/isi/slide4-lambung.webp';
import slide5Lambung from '../../assets/menu-materi-organ-pencernaan/isi/slide5-lambung.webp';

// Slide Usus Halus (4 slides)
import slide1UsusHalus from '../../assets/menu-materi-organ-pencernaan/isi/slide1-usus-halus.webp';
import slide2UsusHalus from '../../assets/menu-materi-organ-pencernaan/isi/slide2-usus-halus.webp';
import slide3UsusHalus from '../../assets/menu-materi-organ-pencernaan/isi/slide3-usus-halus.webp';
import slide4UsusHalus from '../../assets/menu-materi-organ-pencernaan/isi/slide4-usus-halus.webp';

// Slide Usus Besar (4 slides)
import slide1UsusBesar from '../../assets/menu-materi-organ-pencernaan/isi/slide1-usus-besar.webp';
import slide2UsusBesar from '../../assets/menu-materi-organ-pencernaan/isi/slide2-usus-besar.webp';
import slide3UsusBesar from '../../assets/menu-materi-organ-pencernaan/isi/slide3-usus-besar.webp';
import slide4UsusBesar from '../../assets/menu-materi-organ-pencernaan/isi/slide4-usus-besar.webp';

import './MenuMateriOrganIsiScreen.css';

interface OrganTopicData {
  id: string;
  name: string;
  label: string;
  buttonImg: string;
  slides: {
    src: string;
    alt: string;
  }[];
}

const ORGAN_TOPICS: OrganTopicData[] = [
  {
    id: 'mulut',
    name: 'Mulut',
    label: 'MULUT',
    buttonImg: btnMulut,
    slides: [
      { src: slide1Mulut, alt: 'Materi Mulut - Pertanyaan Bu Rini' },
      { src: slide2Mulut, alt: 'Materi Mulut - Penjelasan Pencernaan Mekanik dan Kimiawi' },
      { src: slide3Mulut, alt: 'Materi Mulut - Struktur Gigi, Lidah, dan Kelenjar Ludah' },
      { src: slide4Mulut, alt: 'Materi Mulut - Video Animasi Pembelajaran' },
    ],
  },
  {
    id: 'kerongkongan',
    name: 'Kerongkongan',
    label: 'KERONGKONGAN',
    buttonImg: btnKerongkongan,
    slides: [
      { src: slide1Kerongkongan, alt: 'Materi Kerongkongan - Pertanyaan Bu Rini' },
      { src: slide2Kerongkongan, alt: 'Materi Kerongkongan - Fungsi Mendorong Makanan' },
      { src: slide3Kerongkongan, alt: 'Materi Kerongkongan - Gerak Peristaltik' },
      { src: slide4Kerongkongan, alt: 'Materi Kerongkongan - Video Animasi Pembelajaran' },
    ],
  },
  {
    id: 'lambung',
    name: 'Lambung',
    label: 'LAMBUNG',
    buttonImg: btnLambung,
    slides: [
      { src: slide1Lambung, alt: 'Materi Lambung - Pertanyaan Bu Rini' },
      { src: slide2Lambung, alt: 'Materi Lambung - Proses Mekanik dan Kimiawi di Lambung' },
      { src: slide3Lambung, alt: 'Materi Lambung - Enzim LaPAR (Pepsin, Asam Klorida/HCl, Renin)' },
      { src: slide4Lambung, alt: 'Materi Lambung - Bagian Kardiak, Fundus, dan Pilorus' },
      { src: slide5Lambung, alt: 'Materi Lambung - Video Animasi Pembelajaran' },
    ],
  },
  {
    id: 'usus-halus',
    name: 'Usus Halus',
    label: 'USUS HALUS',
    buttonImg: btnUsusHalus,
    slides: [
      { src: slide1UsusHalus, alt: 'Materi Usus Halus - Pertanyaan Bu Rini' },
      { src: slide2UsusHalus, alt: 'Materi Usus Halus - Penyerapan Zat Gizi Makanan' },
      { src: slide3UsusHalus, alt: 'Materi Usus Halus - Struktur Usus Halus' },
      { src: slide4UsusHalus, alt: 'Materi Usus Halus - Video Animasi Pembelajaran' },
    ],
  },
  {
    id: 'usus-besar',
    name: 'Usus Besar',
    label: 'USUS BESAR',
    buttonImg: btnUsusBesar,
    slides: [
      { src: slide1UsusBesar, alt: 'Materi Usus Besar - Pertanyaan Bu Rini' },
      { src: slide2UsusBesar, alt: 'Materi Usus Besar - Penyerapan Air dan Pembentukan Feses' },
      { src: slide3UsusBesar, alt: 'Materi Usus Besar - Bagian Kolon dan Rektum' },
      { src: slide4UsusBesar, alt: 'Materi Usus Besar - Video Animasi Pembelajaran' },
    ],
  },
];

export const MenuMateriOrganIsiScreen: React.FC = () => {
  const navigate = useNavigate();
  const { organId } = useParams<{ organId?: string }>();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideIndices, setSlideIndices] = useState<Record<string, number>>({});
  const stageRef = useRef<HTMLDivElement>(null);

  // Cari organ aktif berdasarkan URL parameter, fallback ke 'mulut'
  const activeOrganIndex = Math.max(
    0,
    ORGAN_TOPICS.findIndex((item) => item.id.toLowerCase() === (organId || 'mulut').toLowerCase())
  );
  const currentOrgan = ORGAN_TOPICS[activeOrganIndex] || ORGAN_TOPICS[0];
  const totalSlides = currentOrgan.slides.length;
  const currentSlideIndex = slideIndices[currentOrgan.id] ?? 0;

  // Sintesis audio interaktif Web Audio API terpusat & aman
  const playSound = useCallback(
    (type: 'pop' | 'chime' | 'soft') => {
      playSoundEffect(type, soundEnabled);
    },
    [soundEnabled]
  );

  // Kembali ke menu organ utama
  const handleBackToOrganMenu = useCallback(() => {
    playSound('pop');
    navigate('/menu/materi/organ');
  }, [playSound, navigate]);

  // Kembali ke menu dashboard
  const handleGoHome = useCallback(() => {
    playSound('pop');
    navigate('/menu');
  }, [playSound, navigate]);

  // Beralih organ via tab button bawah
  const handleSelectOrgan = (targetId: string) => {
    if (targetId === currentOrgan.id) return;
    playSound('chime');
    setSlideIndices((prev) => ({ ...prev, [targetId]: 0 }));
    navigate(`/menu/materi/organ/isi/${targetId}`);
  };

  // Navigasi slide berikutnya
  const handleNextSlide = useCallback(() => {
    const activeSlide = slideIndices[currentOrgan.id] ?? 0;
    if (activeSlide < totalSlides - 1) {
      playSound('pop');
      setSlideIndices((prev) => ({ ...prev, [currentOrgan.id]: activeSlide + 1 }));
    } else {
      // Jika sudah di slide terakhir organ ini, lanjut ke organ berikutnya
      const nextOrganIdx = (activeOrganIndex + 1) % ORGAN_TOPICS.length;
      const nextOrgan = ORGAN_TOPICS[nextOrganIdx];
      playSound('chime');
      setSlideIndices((prev) => ({ ...prev, [nextOrgan.id]: 0 }));
      navigate(`/menu/materi/organ/isi/${nextOrgan.id}`);
    }
  }, [slideIndices, currentOrgan.id, totalSlides, activeOrganIndex, playSound, navigate]);

  // Navigasi slide sebelumnya
  const handlePrevSlide = useCallback(() => {
    const activeSlide = slideIndices[currentOrgan.id] ?? 0;
    if (activeSlide > 0) {
      playSound('soft');
      setSlideIndices((prev) => ({ ...prev, [currentOrgan.id]: activeSlide - 1 }));
    }
  }, [slideIndices, currentOrgan.id, playSound]);

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

  // Navigasi Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        handleBackToOrganMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSlide, handlePrevSlide, handleBackToOrganMenu]);

  const currentSlide = currentOrgan.slides[currentSlideIndex] || currentOrgan.slides[0];

  return (
    <div className="organ-isi-viewport">
      {/* 16:9 Aspect Ratio Locked Stage */}
      <div className="organ-isi-stage" ref={stageRef}>
        {/* Layer 1: Background Ruang Kelas Bu Rini */}
        <img
          src={bgClassroom}
          alt="Latar Ruang Kelas Materi Organ Pencernaan"
          className="organ-isi-bg"
          draggable={false}
        />

        {/* Layer 2: Slide Materi Transparan (Bu Rini + Balon Dialog / Ilustrasi) */}
        <img
          key={`${currentOrgan.id}-${currentSlideIndex}`}
          src={currentSlide.src}
          alt={currentSlide.alt}
          className="organ-isi-slide"
          draggable={false}
        />

        {/* Layer 3: Top Bar Navigasi (Kembali Materi & Menu Utama) */}
        <div className="organ-isi-topbar">
          <div className="organ-isi-topbar-left">
            <button
              type="button"
              className="organ-isi-corner-btn"
              onClick={handleBackToOrganMenu}
              title="Kembali ke Pilihan Organ"
              aria-label="Kembali ke Pilihan Organ"
            >
              <img src={btnBackMateri} alt="Kembali" />
            </button>
          </div>

          <div className="organ-isi-topbar-right">


            <button
              type="button"
              className="organ-isi-util-btn"
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
              className="organ-isi-util-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? '✕' : '⛶'}
            </button>

            <button
              type="button"
              className="organ-isi-corner-btn"
              onClick={handleGoHome}
              title="Kembali ke Menu Utama"
              aria-label="Menu Utama"
            >
              <img src={btnHome} alt="Menu Utama" />
            </button>
          </div>
        </div>

        {/* Layer 4: Tombol Next Interaktif di Sudut Kanan Bawah Balon Dialog */}
        <button
          type="button"
          className="organ-isi-btn-next"
          onClick={handleNextSlide}
          onMouseEnter={() => playSound('soft')}
          title="Lanjut ke Penjelasan Berikutnya"
          aria-label="Lanjut ke Penjelasan Berikutnya"
        >
          <img src={btnNext} alt="Tombol Lanjut" />
        </button>

        {/* Layer 5: Barisan 5 Tombol Organ Horizontal di Bagian Bawah */}
        <nav
          className="organ-isi-bottombar"
          aria-label="Pilih Organ Pencernaan"
        >
          {ORGAN_TOPICS.map((organ) => {
            const isActive = organ.id === currentOrgan.id;
            return (
              <button
                key={organ.id}
                type="button"
                className={`organ-isi-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelectOrgan(organ.id)}
                onMouseEnter={() => playSound('soft')}
                title={`Pelajari ${organ.name}`}
                aria-label={`Organ ${organ.name}`}
                aria-pressed={isActive}
              >
                <span className={`organ-isi-tab-label organ-isi-label-${organ.id}`}>
                  {organ.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MenuMateriOrganIsiScreen;
