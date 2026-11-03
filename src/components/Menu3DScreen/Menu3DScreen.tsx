import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { playSound as playSoundEffect } from '../../services/soundService';
import bgClassroom from '../../assets/menu-materi-organ-pencernaan/isi/bg-isi-materi-organ-pencernaan.webp';
import btnHome from '../../assets/menu-materi-organ-pencernaan/button-home.webp';
import './Menu3DScreen.css';

interface Organ3DTopic {
  id: string;
  name: string;
  label: string;
  modelId: string;
  description: string;
}

const ORGAN_3D_TOPICS: Organ3DTopic[] = [
  {
    id: 'mulut',
    name: 'Mulut (Cavum Oris)',
    label: 'MULUT',
    modelId: 'c5210cb7db2f4f2ca82c807b7904e491',
    description: 'Awal saluran pencernaan untuk proses mekanik & kimiawi makanan.',
  },
  {
    id: 'kerongkongan',
    name: 'Kerongkongan (Esofagus)',
    label: 'KERONGKONGAN',
    modelId: '479c15c7e6fe4cdb8c481f4d2047a686',
    description: 'Saluran berotot yang menggerakkan bolus dengan gerak peristaltik.',
  },
  {
    id: 'lambung',
    name: 'Lambung (Ventrikulus)',
    label: 'LAMBUNG',
    modelId: '34bbf12325a34dd5abf4feb12587b97a',
    description: 'Kantung pencernaan dengan asam lambung (HCl) dan enzim pepsin.',
  },
  {
    id: 'usus-halus',
    name: 'Usus Halus (Intestinum Tenue)',
    label: 'USUS HALUS',
    modelId: 'cf728ce3ec2448f8b9f14e599aa1dd63',
    description: 'Pusat penyerapan sari makanan (duodenum, jejunum, dan ileum).',
  },
  {
    id: 'usus-besar',
    name: 'Usus Besar (Kolon)',
    label: 'USUS BESAR',
    modelId: '0ec6613f1fdd494998b8711deacd55d8',
    description: 'Penyerapan air, pembentukan feses, dan pembusukan oleh E. coli.',
  },
];

export const Menu3DScreen: React.FC = () => {
  const navigate = useNavigate();
  const { organId } = useParams<{ organId?: string }>();
  const stageRef = useRef<HTMLDivElement>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  // Cari organ aktif dari parameter URL, fallback ke 'mulut'
  const activeOrgan =
    ORGAN_3D_TOPICS.find(
      (topic) => topic.id.toLowerCase() === organId?.toLowerCase()
    ) || ORGAN_3D_TOPICS[0];

  const playSound = useCallback(
    (type: 'pop' | 'chime' | 'soft') => {
      playSoundEffect(type, soundEnabled);
    },
    [soundEnabled]
  );

  const handleSelectOrgan = (newOrganId: string) => {
    if (newOrganId === activeOrgan.id) return;
    playSound('chime');
    setIsLoadingIframe(true);
    navigate(`/menu/3d/${newOrganId}`);
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

  // URL embed Sketchfab resmi dengan parameter optimal
  const embedUrl = `https://sketchfab.com/models/${activeOrgan.modelId}/embed?autostart=1&preload=1&ui_theme=dark&ui_watermark=0&ui_hint=2`;

  return (
    <div className="menu-3d-viewport">
      {/* 16:9 Aspect Ratio Locked Stage */}
      <div className="menu-3d-stage" ref={stageRef}>
        {/* Layer 1: Latar Belakang Ruang Kelas Edukasi DIGESTA */}
        <img
          src={bgClassroom}
          alt="Latar Belakang Ruang Kelas Laboratorium 3D"
          className="menu-3d-bg"
          draggable={false}
        />
        <div className="menu-3d-overlay" />

        {/* Layer 2: Topbar Navigasi & Kontrol */}
        <div className="menu-3d-topbar">
          <div className="menu-3d-topbar-left">
            <button
              type="button"
              className="menu-3d-corner-btn"
              onClick={handleGoHome}
              title="Kembali ke Menu Utama"
              aria-label="Kembali ke Menu Utama"
            >
              <img src={btnHome} alt="Menu Utama" />
            </button>

            <div className="menu-3d-title-badge">
              <div className="menu-3d-badge-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="menu-3d-badge-text">3D ORGAN PENCERNAAN</span>
            </div>
          </div>

          <div className="menu-3d-topbar-right">
            <button
              type="button"
              className="menu-3d-util-btn"
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
              className="menu-3d-util-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? '✕' : '⛶'}
            </button>
          </div>
        </div>

        {/* Layer 3: Kontainer Utama Viewer 3D Interaktif */}
        <div className="menu-3d-main-container">
          <div className="menu-3d-card-frame">
            {/* Header Card: Judul Organ & Panduan Kontrol 3D */}
            <div className="menu-3d-card-header">
              <div className="menu-3d-header-left">
                <div className="menu-3d-organ-tag">{activeOrgan.label}</div>
                <div className="menu-3d-organ-desc">{activeOrgan.description}</div>
              </div>

              <div className="menu-3d-controls-guide">
                <div className="menu-3d-guide-pill" title="Klik dan geser mouse untuk memutar organ 360°">
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
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                  <span>Putar 360°</span>
                </div>

                <div className="menu-3d-guide-pill" title="Gunakan roda scroll mouse untuk memperbesar / memperkecil">
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
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Zoom</span>
                </div>

                <div className="menu-3d-guide-pill" title="Klik kanan dan geser untuk menggeser posisi sudut pandang">
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
                    <polyline points="5 9 2 12 5 15" />
                    <polyline points="9 5 12 2 15 5" />
                    <polyline points="15 19 12 22 9 19" />
                    <polyline points="19 9 22 12 19 15" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                  </svg>
                  <span>Geser</span>
                </div>
              </div>
            </div>

            {/* Area Embed Iframe Sketchfab */}
            <div className="menu-3d-viewer-wrapper">
              {isLoadingIframe && (
                <div className="menu-3d-loading-overlay">
                  <div className="menu-3d-loading-spinner" />
                  <div className="menu-3d-loading-text">Memuat Model 3D {activeOrgan.name}...</div>
                </div>
              )}

              <iframe
                key={activeOrgan.id}
                title={`Model 3D ${activeOrgan.name}`}
                className="menu-3d-iframe"
                src={embedUrl}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                onLoad={() => setIsLoadingIframe(false)}
              />
            </div>
          </div>
        </div>

        {/* Layer 5: Barisan 5 Tombol Organ Horizontal di Bagian Bawah */}
        <nav className="menu-3d-bottombar" aria-label="Pilih Organ 3D">
          {ORGAN_3D_TOPICS.map((organ) => {
            const isActive = organ.id === activeOrgan.id;
            return (
              <button
                key={organ.id}
                type="button"
                className={`menu-3d-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelectOrgan(organ.id)}
                onMouseEnter={() => playSound('soft')}
                title={`Lihat Model 3D ${organ.name}`}
                aria-label={`Model 3D ${organ.name}`}
                aria-pressed={isActive}
              >
                <span className={`menu-3d-tab-label menu-3d-label-${organ.id}`}>
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

export default Menu3DScreen;
