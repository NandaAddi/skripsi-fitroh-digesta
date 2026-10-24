import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/menu-screen/bg-menuscreen.webp';
import logoImg from '../../assets/menu-screen/logo-menuscreen.webp';
import btnSettings from '../../assets/menu-screen/button-settings.webp';
import btnExit from '../../assets/menu-screen/button-exit.webp';
import { useAuth } from '../../context/AuthContext';
import { MENU_ITEMS, type MenuItem } from '../../data/modules';
import type { User } from '../../services/auth';
import './MenuScreen.css';

export interface MenuScreenProps {
  currentUser?: User | null;
  onLogout?: () => void;
  onBackToStart?: () => void;
  onSelectMenu?: (menuId: string) => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  currentUser,
  onLogout,
  onBackToStart,
  onSelectMenu,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const activeUser = currentUser || user;

  const [activeModal, setActiveModal] = useState<'settings' | 'exit' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
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
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'chime') {
        // Nada ceria dua tingkat
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(520, ctx.currentTime);
        osc1.frequency.setValueAtTime(780, ctx.currentTime + 0.08);
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
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      // Browser audio context policy fallback
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.id === 'materi') {
      playSound('chime');
      if (onSelectMenu) {
        onSelectMenu(item.id);
      }
      navigate('/menu/materi');
    } else if (item.id === 'pengantar') {
      playSound('chime');
      if (onSelectMenu) {
        onSelectMenu(item.id);
      }
      navigate('/menu/pengantar');
    } else {
      playSound('soft');
      if (onSelectMenu) {
        onSelectMenu(item.id);
      }
    }
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

  return (
    <div className="menuscreen-viewport">
      {/* 16:9 Aspect Ratio Locked Stage */}
      <div className="menuscreen-stage" ref={stageRef}>
        {/* Layer 1: Background Dinding Bata Putih */}
        <img
          src={bgImg}
          alt="Latar Belakang Bata DIGESTA"
          className="menuscreen-bg"
          draggable={false}
        />

        {/* Layer 2: Maskot Lambung Ceria & Logo DiGESTA */}
        <img
          src={logoImg}
          alt="DiGESTA - Digital Interactive Gastrointestinal Education System"
          className="menuscreen-illustration"
          draggable={false}
        />

        {/* Pojok Kiri Atas: Tombol Pengaturan (Settings) */}
        <button
          type="button"
          className="menuscreen-round-btn menuscreen-btn-settings"
          onClick={() => {
            playSound('pop');
            setActiveModal('settings');
          }}
          title="Pengaturan"
          aria-label="Buka Pengaturan"
        >
          <img
            src={btnSettings}
            alt="Pengaturan"
            className="menuscreen-round-img"
            draggable={false}
          />
        </button>

        {/* Pojok Kanan Atas: Tombol Keluar (Exit) */}
        <button
          type="button"
          className="menuscreen-round-btn menuscreen-btn-exit"
          onClick={() => {
            playSound('pop');
            setActiveModal('exit');
          }}
          title="Keluar"
          aria-label="Buka Menu Keluar"
        >
          <img
            src={btnExit}
            alt="Keluar"
            className="menuscreen-round-img"
            draggable={false}
          />
        </button>

        {/* Layer 3: Grid 6 Tombol Menu Utama (2 Baris x 3 Kolom) */}
        <div className="menuscreen-grid-container">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`menuscreen-menu-card menuscreen-card-${item.id}`}
              onClick={() => handleMenuClick(item)}
              onMouseEnter={() => playSound('soft')}
              title={item.title}
              aria-label={item.title}
            >
              <img
                src={item.img}
                alt={item.title}
                className="menuscreen-card-img"
                draggable={false}
              />
            </button>
          ))}
        </div>

        {/* Modal Pengaturan (Settings) */}
        {activeModal === 'settings' && (
          <div className="menuscreen-modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="menuscreen-modal-card menuscreen-modal-settings" onClick={(e) => e.stopPropagation()}>
              <div className="menuscreen-modal-header">
                <span className="menuscreen-modal-badge menuscreen-badge-settings">
                  PENGATURAN
                </span>
                <h2 className="menuscreen-modal-title">Pengaturan DIGESTA</h2>
              </div>

              <div className="menuscreen-settings-list">
                {/* Efek Suara */}
                <div className="menuscreen-setting-row">
                  <div>
                    <div className="menuscreen-setting-label">Efek Suara Audio</div>
                    <div className="menuscreen-setting-sub">Bunyi kartun saat tombol disentuh</div>
                  </div>
                  <button
                    type="button"
                    className={`menuscreen-switch ${soundEnabled ? 'active' : ''}`}
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      if (next) playSound('pop');
                    }}
                  >
                    <span>{soundEnabled ? 'AKTIF' : 'MATI'}</span>
                  </button>
                </div>

                {/* Layar Penuh */}
                <div className="menuscreen-setting-row">
                  <div>
                    <div className="menuscreen-setting-label">Mode Layar Penuh</div>
                    <div className="menuscreen-setting-sub">Tampilan maksimal tanpa gangguan</div>
                  </div>
                  <button
                    type="button"
                    className="menuscreen-btn-action"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
                  </button>
                </div>

                {/* Profil Pengguna */}
                {activeUser && (
                  <div className="menuscreen-setting-row">
                    <div>
                      <div className="menuscreen-setting-label">Pengguna Aktif</div>
                      <div className="menuscreen-setting-sub">{activeUser.email}</div>
                    </div>
                    <span className="menuscreen-user-tag">
                      {activeUser.fullName} ({activeUser.role === 'guest' ? 'Tamu' : 'Siswa'})
                    </span>
                  </div>
                )}
              </div>

              <div className="menuscreen-modal-actions-game">
                <button
                  type="button"
                  className="menuscreen-game-btn menuscreen-btn-primary"
                  onClick={() => {
                    playSound('soft');
                    setActiveModal(null);
                  }}
                >
                  Simpan & Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Keluar (Exit) */}
        {activeModal === 'exit' && (
          <div className="menuscreen-modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="menuscreen-modal-card menuscreen-modal-exit" onClick={(e) => e.stopPropagation()}>
              <div className="menuscreen-modal-header">
                <span className="menuscreen-modal-badge menuscreen-badge-exit">
                  KELUAR
                </span>
                <h2 className="menuscreen-modal-title">Keluar dari DIGESTA</h2>
              </div>

              <p className="menuscreen-modal-desc">
                Apakah kamu ingin keluar dari menu pembelajaran atau berganti akun?
              </p>

              <div className="menuscreen-modal-actions-game">
                <button
                  type="button"
                  className="menuscreen-game-btn menuscreen-btn-danger"
                  onClick={async () => {
                    playSound('pop');
                    setActiveModal(null);
                    if (onLogout) {
                      onLogout();
                    } else {
                      await logout();
                      navigate('/login');
                    }
                  }}
                >
                  Ganti Akun / Logout
                </button>

                <button
                  type="button"
                  className="menuscreen-game-btn menuscreen-btn-primary"
                  onClick={() => {
                    playSound('pop');
                    setActiveModal(null);
                    if (onBackToStart) {
                      onBackToStart();
                    } else {
                      navigate('/');
                    }
                  }}
                >
                  Kembali ke Start Screen
                </button>

                <button
                  type="button"
                  className="menuscreen-game-btn menuscreen-btn-neutral"
                  onClick={() => {
                    playSound('soft');
                    setActiveModal(null);
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuScreen;
