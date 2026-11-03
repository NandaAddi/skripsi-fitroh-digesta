import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { playSound as playSoundEffect } from '../../services/soundService';

// Background & Tombol Navigasi WebP
import bgOrganPencernaan from '../../assets/menu-materi-organ-pencernaan/bg-materi-organ-pencernaan.webp';
import btnBackMateri from '../../assets/menu-materi-organ-pencernaan/button-back-menu-materi.webp';
import btnHome from '../../assets/menu-materi-organ-pencernaan/button-home.webp';

// Tombol Organ Pencernaan WebP
import btnMulut from '../../assets/menu-materi-organ-pencernaan/button-mulut.webp';
import btnKerongkongan from '../../assets/menu-materi-organ-pencernaan/button-kerongkongan.webp';
import btnLambung from '../../assets/menu-materi-organ-pencernaan/button-lambung.webp';
import btnUsusHalus from '../../assets/menu-materi-organ-pencernaan/button-usus-halus.webp';
import btnUsusBesar from '../../assets/menu-materi-organ-pencernaan/button-usus-besar.webp';

import './MenuMateriOrganScreen.css';

interface OrganItem {
  id: string;
  label: string;
  imgSrc: string;
}

const ORGAN_LIST: OrganItem[] = [
  { id: 'mulut', label: 'Mulut', imgSrc: btnMulut },
  { id: 'kerongkongan', label: 'Kerongkongan', imgSrc: btnKerongkongan },
  { id: 'lambung', label: 'Lambung', imgSrc: btnLambung },
  { id: 'usus-halus', label: 'Usus Halus', imgSrc: btnUsusHalus },
  { id: 'usus-besar', label: 'Usus Besar', imgSrc: btnUsusBesar },
];

export const MenuMateriOrganScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleBackToMateri = useCallback(() => {
    playSound('pop');
    navigate('/menu/materi');
  }, [playSound, navigate]);

  const handleGoHome = useCallback(() => {
    playSound('pop');
    navigate('/menu');
  }, [playSound, navigate]);

  const handleOrganClick = (organ: OrganItem) => {
    playSound('chime');
    navigate(`/menu/materi/organ/isi/${organ.id}`);
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

  // Navigasi Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBackToMateri();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackToMateri]);

  return (
    <div className="organ-pencernaan-viewport">
      {/* 16:9 Aspect Ratio Locked Stage */}
      <div className="organ-pencernaan-stage" ref={stageRef}>
        {/* Layer 1: Background Dinding Bata & Anatomi Tubuh */}
        <img
          src={bgOrganPencernaan}
          alt="Latar Organ Pencernaan Pada Manusia"
          className="organ-pencernaan-bg"
          draggable={false}
        />

        {/* Layer 2: Top Bar Navigasi & Informasi */}
        <div className="organ-topbar">
          <div className="organ-topbar-left">
            <button
              type="button"
              className="organ-corner-btn"
              onClick={handleBackToMateri}
              title="Kembali ke Daftar Materi"
              aria-label="Kembali ke Daftar Materi"
            >
              <img src={btnBackMateri} alt="Kembali ke Materi" />
            </button>
          </div>

          <div className="organ-topbar-right">
            {user && (
              <span className="organ-user-tag">
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
              className="organ-util-btn"
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
              className="organ-util-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? '✕' : '⛶'}
            </button>

            <button
              type="button"
              className="organ-corner-btn"
              onClick={handleGoHome}
              title="Kembali ke Menu Utama"
              aria-label="Menu Utama"
            >
              <img src={btnHome} alt="Menu Utama" />
            </button>
          </div>
        </div>

        {/* Layer 3: Susunan 5 Tombol Organ di Kolom Tengah */}
        <div className="organ-buttons-stack">
          {ORGAN_LIST.map((organ) => (
            <button
              key={organ.id}
              type="button"
              className="organ-btn"
              onClick={() => handleOrganClick(organ)}
              onMouseEnter={() => playSound('soft')}
              title={`Pelajari Organ ${organ.label}`}
              aria-label={organ.label}
            >
              <img src={organ.imgSrc} alt={organ.label} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuMateriOrganScreen;
