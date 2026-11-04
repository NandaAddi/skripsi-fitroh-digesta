import React from 'react';
import './OrientationOverlay.css';

interface OrientationOverlayProps {
  show: boolean;
}

export const OrientationOverlay: React.FC<OrientationOverlayProps> = ({ show }) => {
  if (!show) return null;

  return (
    <aside
      className="orientation-overlay"
      role="alert"
      aria-live="polite"
      aria-label="Pemberitahuan putar orientasi perangkat"
    >
      <div className="orientation-card">
        {/* Badge Plat Judul Game 3D */}
        <div className="orientation-badge-plate">
          <span className="orientation-badge-text">MODE PERMAINAN</span>
        </div>

        {/* Animasi Kartun Ponsel Berputar 90 Derajat */}
        <div className="orientation-anim-container" aria-hidden="true">
          <div className="orientation-phone-device">
            <div className="orientation-phone-screen">
              <div className="orientation-phone-notch" />
              <div className="orientation-phone-inner-logo">DIGESTA</div>
            </div>
          </div>
          {/* Panah Indikator Rotasi Busur Halus */}
          <svg
            className="orientation-rotation-arrow"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 22,50 A 28,28 0 1,1 50,78"
              stroke="#fbbf24"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="6 3"
            />
            <polygon points="50,68 64,78 50,88" fill="#fbbf24" />
          </svg>
        </div>

        {/* Teks Instruksi Game */}
        <h2 className="orientation-title">Putar Ponsel ke Lanskap</h2>
        <p className="orientation-description">
          Aplikasi interaktif <strong>DIGESTA</strong> dirancang untuk pengalaman belajar visual rasio 16:9.
          Silakan putar smartphone Anda ke posisi <strong>horizontal (lanskap)</strong>.
        </p>

        {/* Tips Bantuan */}
        <div className="orientation-tip-badge">
          <svg
            className="orientation-tip-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <span>Pastikan fitur Rotasi Layar otomatis di ponsel Anda aktif</span>
        </div>
      </div>
    </aside>
  );
};

export default OrientationOverlay;

