import React, { useEffect, useState, useRef } from 'react';
import digestaLogo from '../../assets/logo-digiesta.webp';
import { preloadAllAssets, BIOLOGY_TRIVIA } from '../../services/assetManifest';
import './AssetPreloader.css';

interface AssetPreloaderProps {
  onComplete: () => void;
}

export const AssetPreloader: React.FC<AssetPreloaderProps> = ({ onComplete }) => {
  const [actualProgress, setActualProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [statusText, setStatusText] = useState('Memulai persiapan laboratorium...');
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [isTriviaFading, setIsTriviaFading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const displayProgressRef = useRef(0);
  const isCompletedRef = useRef(false);

  // 1. Eksekusi Preload Aset
  useEffect(() => {
    let isMounted = true;

    preloadAllAssets((loaded, total, label) => {
      if (!isMounted) return;
      const percentage = Math.min(100, Math.round((loaded / total) * 100));
      setActualProgress(percentage);
      setStatusText(`Menyiapkan: ${label}`);
    }).then(() => {
      if (!isMounted) return;
      setActualProgress(100);
      setStatusText('Semua modul siap! Membuka panggung...');
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Interpolasi Animasi Bar Progress yang Halus
  useEffect(() => {
    let animId: number;

    const animateProgress = () => {
      if (displayProgressRef.current < actualProgress) {
        // Meluncur mulus menuju progress aktual
        const step = Math.max(1, (actualProgress - displayProgressRef.current) * 0.15);
        const nextVal = Math.min(actualProgress, displayProgressRef.current + step);
        displayProgressRef.current = nextVal;
        setDisplayProgress(Math.floor(nextVal));
      }

      // Begitu progress mencapai 100%, picu transisi selesai
      if (displayProgressRef.current >= 100 && !isCompletedRef.current) {
        isCompletedRef.current = true;
        setDisplayProgress(100);
        setStatusText('Siap Berpetualang!');

        // Jeda visual 350ms sebelum fade out
        setTimeout(() => {
          setIsFadingOut(true);

          // Selesaikan pemuatan setelah transisi CSS fade-out (450ms)
          setTimeout(() => {
            onComplete();
          }, 450);
        }, 350);
        return;
      }

      if (!isCompletedRef.current) {
        animId = requestAnimationFrame(animateProgress);
      }
    };

    animId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [actualProgress, onComplete]);

  // 3. Rotasi Trivia Sains Sistem Pencernaan Setiap 3 Detik
  useEffect(() => {
    const triviaInterval = setInterval(() => {
      setIsTriviaFading(true);
      setTimeout(() => {
        setTriviaIndex((prev) => (prev + 1) % BIOLOGY_TRIVIA.length);
        setIsTriviaFading(false);
      }, 300);
    }, 3200);

    return () => clearInterval(triviaInterval);
  }, []);

  return (
    <div className={`preloader-viewport ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="preloader-stage">
        {/* Ambient Glow Lingkaran Hangat */}
        <div className="preloader-ambient-glow" />

        {/* Konten Utama Preloader */}
        <div className="preloader-content">
          {/* Logo DIGESTA dengan denyut lembut */}
          <div className="preloader-logo-wrapper">
            <img
              src={digestaLogo}
              alt="DIGESTA - Digital Interactive Gastrointestinal Education System"
              className="preloader-logo-img"
              draggable={false}
            />
          </div>

          {/* Section Progress Bar Game 3D */}
          <div className="preloader-bar-section">
            <div className="preloader-status-row">
              <span className="preloader-status-text">{statusText}</span>
              <span className="preloader-percentage-text">{displayProgress}%</span>
            </div>

            {/* Rel Progress Bar */}
            <div className="preloader-track">
              <div
                className="preloader-fill"
                style={{ width: `${Math.max(4, displayProgress)}%` }}
              />
            </div>
          </div>

          {/* Box Fakta Sains / Game Tips */}
          <div className="preloader-trivia-box">
            <div className="preloader-trivia-badge">TAHUKAH KAMU?</div>
            <div className={`preloader-trivia-text ${isTriviaFading ? 'fade' : ''}`}>
              &ldquo;{BIOLOGY_TRIVIA[triviaIndex]}&rdquo;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetPreloader;
