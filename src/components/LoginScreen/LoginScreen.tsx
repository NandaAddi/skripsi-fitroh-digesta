import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bgImg from '../../assets/login-screen/bg-loginscreen.webp';
import logoImg from '../../assets/login-screen/assets-loginscreen.webp';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../services/auth';
import './LoginScreen.css';

export interface LoginScreenProps {
  onLoginSuccess?: (user: User) => void;
  onBack?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onBack,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsStudent, loginAsGuest, isAuthenticated } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/menu';

  const [fullName, setFullName] = useState('');
  const [attendanceNumber, setAttendanceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Otomatis redirect ke tujuan jika pengguna sudah terautentikasi
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Sintesis efek suara ceria berbasis Web Audio API
  const playSound = (type: 'pop' | 'success' | 'error') => {
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
        osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'success') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(520, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(680, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.32);
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch {
      // Fallback diam jika audio context dibatasi oleh browser policy
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      playSound('error');
      setErrorMsg('Nama lengkap minimal 2 karakter.');
      return;
    }

    const absNum = parseInt(attendanceNumber, 10);
    if (!attendanceNumber || isNaN(absNum) || absNum < 1 || absNum > 99) {
      playSound('error');
      setErrorMsg('Nomor absen harus berupa angka antara 1 sampai 99.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginAsStudent({
        fullName: trimmedName,
        attendanceNumber: absNum,
      });

      if (res.error) {
        playSound('error');
        setErrorMsg(res.error);
      } else if (res.user) {
        playSound('success');
        setSuccessMsg(`Selamat datang, ${res.user.fullName}! (No. Absen: ${res.user.attendanceNumber})`);
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(res.user!);
          navigate(from, { replace: true });
        }, 550);
      }
    } catch {
      playSound('error');
      setErrorMsg('Terjadi kesalahan saat memproses data.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    playSound('pop');
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginAsGuest();
      if (res.user) {
        playSound('success');
        setSuccessMsg('Masuk sebagai Tamu...');
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(res.user!);
          navigate(from, { replace: true });
        }, 450);
      }
    } finally {
      setLoading(false);
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
    <div className="loginscreen-viewport">
      {/* 16:9 Aspect Ratio Strictly Locked Container Stage */}
      <div className="loginscreen-stage" ref={stageRef}>
        {/* Layer 1: Background Dinding Bata Putih */}
        <img
          src={bgImg}
          alt="Latar Belakang Bata DIGESTA"
          className="loginscreen-bg"
          draggable={false}
        />

        {/* Layer 2: Maskot Lambung Ceria & Logo DiGESTA */}
        <img
          src={logoImg}
          alt="DiGESTA - Digital Interactive Gastrointestinal Education System"
          className="loginscreen-illustration"
          draggable={false}
        />

        {/* Top Bar Navigasi & Kontrol Audio/Fullscreen */}
        <div className="loginscreen-topbar">
          <button
            type="button"
            className="loginscreen-btn-round"
            onClick={() => {
              playSound('pop');
              if (onBack) {
                onBack();
              } else {
                navigate('/');
              }
            }}
            title="Kembali ke Start Screen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Kembali</span>
          </button>

          <div className="loginscreen-controls-right">
            <button
              type="button"
              className="loginscreen-icon-btn"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playSound('pop');
              }}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              )}
            </button>

            <button
              type="button"
              className="loginscreen-icon-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Layer 3: Panel Kartu Form Siswa */}
        <div className="loginscreen-card-wrapper">
          <div className="loginscreen-card">
            {/* Header Judul Game */}
            <div className="loginscreen-card-header">
              <h2 className="loginscreen-title">Identitas Siswa</h2>
            </div>

            {/* Alert Notifikasi Error / Sukses */}
            {errorMsg && (
              <div className="loginscreen-alert error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="loginscreen-alert success">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form Input: Nama & Nomor Absen */}
            <form className="loginscreen-form" onSubmit={handleSubmit}>
              <div className="loginscreen-input-group">
                <span className="loginscreen-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="text"
                  className="loginscreen-input"
                  placeholder="Nama Lengkap Siswa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={50}
                  required
                  autoFocus
                />
              </div>

              <div className="loginscreen-input-group">
                <span className="loginscreen-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="9" x2="20" y2="9"></line>
                    <line x1="4" y1="15" x2="20" y2="15"></line>
                    <line x1="10" y1="3" x2="8" y2="21"></line>
                    <line x1="16" y1="3" x2="14" y2="21"></line>
                  </svg>
                </span>
                <input
                  type="number"
                  className="loginscreen-input"
                  placeholder="Nomor Absen (1 - 99)"
                  value={attendanceNumber}
                  onChange={(e) => setAttendanceNumber(e.target.value)}
                  min={1}
                  max={99}
                  required
                />
              </div>

              <button
                type="submit"
                className="loginscreen-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <span>Mulai Belajar</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Pemisah Antara Form Siswa & Tamu */}
            <div className="loginscreen-divider">
              <span>atau</span>
            </div>

            {/* Tombol Akses Tamu Langsung */}
            <button
              type="button"
              className="loginscreen-guest-btn"
              onClick={handleGuestLogin}
              disabled={loading}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                <path d="M12 9v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
              </svg>
              <span>Masuk sebagai Siswa Tamu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Indikator Mode Lanskap untuk Perangkat Mobile (Tampil Otomatis saat Layar Vertikal/Portrait) */}
      <div className="loginscreen-orientation-hint" aria-hidden="true">
        <div className="loginscreen-orientation-card">
          <div className="loginscreen-phone-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="3" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <div className="loginscreen-orientation-text">
            <span className="loginscreen-orientation-title">Putar ke Mode Lanskap</span>
            <span className="loginscreen-orientation-sub">Miringkan HP untuk tampilan pembelajaran penuh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
