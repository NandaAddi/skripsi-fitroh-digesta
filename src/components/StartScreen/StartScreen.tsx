import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bgImg from '../../assets/start-screen/bg-startscreen.webp';
import btnImg from '../../assets/start-screen/button-startscreen.webp';
import teacherMotionImg from '../../assets/teacher-motion/teacher-motion.webp';
import { playSound } from '../../services/soundService';
import './StartScreen.css';

export interface StartScreenProps {
  onStart?: () => void;
  title?: string;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);

  const playPopSound = () => {
    playSound('chime', soundEnabled);
  };

  const handleStartClick = () => {
    playPopSound();
    if (onStart) {
      onStart();
    } else {
      if (isAuthenticated) {
        navigate('/menu');
      } else {
        navigate('/login');
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="startscreen-viewport">
      {/* 16:9 Aspect Ratio Locked Stage */}
      <div className="startscreen-stage" ref={stageRef}>
        {/* Semantic H1 for SEO & Accessibility */}
        <h1 className="sr-only">DIGESTA - Edukasi Sistem Pencernaan Manusia Interaktif</h1>

        {/* Layer 1: Background Layout 16:9 HD */}
        <img
          src={bgImg}
          alt="Latar Belakang DIGESTA"
          className="startscreen-bg"
          draggable={false}
        />

        {/* Layer 2: Animated Teacher Character Motion */}
        <img
          src={teacherMotionImg}
          alt="Karakter Animasi Guru"
          className="startscreen-teacher-motion"
          draggable={false}
        />

        {/* Layer 3: Interactive START Button */}
        <div className="startscreen-button-container">
          <button
            type="button"
            className="startscreen-btn"
            onClick={handleStartClick}
            aria-label="Mulai DIGESTA"
          >
            <img
              src={btnImg}
              alt="START"
              className="startscreen-btn-img"
              draggable={false}
            />
          </button>
        </div>

        {/* Top-Right Control Buttons (Audio & Fullscreen) */}
        <div className="startscreen-controls">
          <button
            type="button"
            className="startscreen-control-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            )}
          </button>

          <button
            type="button"
            className="startscreen-control-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Fullscreen' : 'Mode Layar Penuh'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Demo Callback Modal / Game Start Transition */}
        {showDemoModal && (
          <div className="startscreen-modal-overlay" onClick={() => setShowDemoModal(false)}>
            <div className="startscreen-modal-card" onClick={(e) => e.stopPropagation()}>
              <h2 className="startscreen-modal-title">🎉 Selamat Datang di DIGESTA!</h2>
              <p className="startscreen-modal-desc">
                Tombol <strong>START</strong> berhasil diklik! Sistem siap dialihkan ke modul pembelajaran gastrointestinal selanjutnya.
              </p>
              <button
                type="button"
                className="startscreen-modal-close-btn"
                onClick={() => setShowDemoModal(false)}
              >
                Kembali ke Start Screen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
