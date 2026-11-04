import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/menu-screen/bg-menuscreen.webp';
import logoImg from '../../assets/menu-screen/logo-menuscreen.webp';
import btnSettings from '../../assets/menu-screen/button-settings.webp';
import btnExit from '../../assets/menu-screen/button-exit.webp';
import { useAuth } from '../../context/AuthContext';
import { MENU_ITEMS, type MenuItem } from '../../data/modules';
import type { User } from '../../services/auth';
import {
  playSound as playSoundEffect,
  isSoundEnabled,
  setSoundEnabled as saveSoundPref,
} from '../../services/soundService';
import './MenuScreen.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

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
  const [soundEnabled, setSoundEnabled] = useState(() => isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((navigator as { standalone?: boolean }).standalone)
    );
  });
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    playSound('pop');
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsPwaInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Efek suara interaktif terpusat
  const playSound = (type: 'pop' | 'chime' | 'soft') => {
    playSoundEffect(type, soundEnabled);
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
    } else if (item.id === '3d') {
      playSound('chime');
      if (onSelectMenu) {
        onSelectMenu(item.id);
      }
      navigate('/menu/3d');
    } else if (item.id === 'kuis') {
      playSound('chime');
      if (onSelectMenu) {
        onSelectMenu(item.id);
      }
      navigate('/menu/kuis');
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

        {/* Layer 3: Tata Letak Tombol Menu (Baris 1: 3 Tombol, Baris 2: 2 Tombol Terpusat) */}
        <div className="menuscreen-menu-layout">
          <div className="menuscreen-row menuscreen-row-top">
            {MENU_ITEMS.slice(0, 3).map((item) => (
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

          <div className="menuscreen-row menuscreen-row-bottom">
            {MENU_ITEMS.slice(3, 5).map((item) => (
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
                      saveSoundPref(next);
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

                {/* Aplikasi Mandiri / Progressive Web App (PWA) */}
                <div className="menuscreen-setting-row">
                  <div>
                    <div className="menuscreen-setting-label">Aplikasi Mandiri (PWA)</div>
                    <div className="menuscreen-setting-sub">
                      {isPwaInstalled
                        ? 'Aplikasi telah terpasang & dapat dimainkan tanpa koneksi'
                        : deferredPrompt
                          ? 'Pasang ke layar utama untuk akses instan tanpa browser'
                          : 'Mendukung penyimpanan offline & dapat ditambahkan ke Beranda'}
                    </div>
                  </div>
                  {isPwaInstalled ? (
                    <span
                      className="menuscreen-user-tag"
                      style={{
                        background: 'linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%)',
                        borderColor: '#22c55e',
                        color: '#15803d',
                      }}
                    >
                      Terpasang
                    </span>
                  ) : deferredPrompt ? (
                    <button
                      type="button"
                      className="menuscreen-btn-action"
                      style={{
                        background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                        borderColor: '#86efac',
                        boxShadow: '0 5px 0 #15803d',
                      }}
                      onClick={handleInstallPwa}
                    >
                      Pasang Aplikasi
                    </button>
                  ) : (
                    <span
                      className="menuscreen-user-tag"
                      style={{
                        background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)',
                        borderColor: '#0284c7',
                        color: '#0369a1',
                      }}
                    >
                      Siap Offline
                    </span>
                  )}
                </div>

                {/* Profil Pengguna */}
                {activeUser && (
                  <div className="menuscreen-setting-row">
                    <div>
                      <div className="menuscreen-setting-label">Pengguna Aktif</div>
                      <div className="menuscreen-setting-sub">
                        {activeUser.attendanceNumber
                          ? `No. Absen: ${activeUser.attendanceNumber}`
                          : activeUser.role === 'guest'
                            ? 'Siswa Tamu (Tanpa Absen)'
                            : activeUser.email || 'Siswa DIGESTA'}
                      </div>
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
