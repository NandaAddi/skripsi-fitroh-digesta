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
  const { login, signUp, loginAsGuest, isAuthenticated } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/menu';

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleTabSwitch = (newTab: 'login' | 'register') => {
    playSound('pop');
    setTab(newTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await login({ email, password });
        if (res.error) {
          playSound('error');
          setErrorMsg(res.error);
        } else if (res.user) {
          playSound('success');
          setSuccessMsg(`Selamat datang, ${res.user.fullName}!`);
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess(res.user!);
            navigate(from, { replace: true });
          }, 600);
        }
      } else {
        const res = await signUp({ email, password, fullName });
        if (res.error) {
          playSound('error');
          setErrorMsg(res.error);
        } else if (res.user) {
          playSound('success');
          setSuccessMsg(`Pendaftaran berhasil! Selamat datang, ${res.user.fullName}!`);
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess(res.user!);
            navigate(from, { replace: true });
          }, 600);
        }
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

        {/* Layer 3: Mockup Panel Login di Bagian Bawah Dinding Bata */}
        <div className="loginscreen-card-wrapper">
          <div className="loginscreen-card">
            {/* Tab: Masuk / Daftar */}
            <div className="loginscreen-tabs">
              <button
                type="button"
                className={`loginscreen-tab ${tab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('login')}
              >
                Masuk
              </button>
              <button
                type="button"
                className={`loginscreen-tab ${tab === 'register' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('register')}
              >
                Daftar Akun
              </button>
            </div>

            {/* Alert Notifikasi Error / Sukses */}
            {errorMsg && (
              <div className="loginscreen-alert error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="loginscreen-alert success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form Input */}
            <form className="loginscreen-form" onSubmit={handleSubmit}>
              {tab === 'register' && (
                <div className="loginscreen-input-group">
                  <span className="loginscreen-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="loginscreen-input"
                    placeholder="Nama Lengkap Siswa / Guru"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="loginscreen-input-group">
                <span className="loginscreen-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  type="email"
                  className="loginscreen-input"
                  placeholder="Email (misal: siswa@sekolah.id)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="loginscreen-input-group">
                <span className="loginscreen-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="loginscreen-input"
                  placeholder="Kata Sandi (min. 6 karakter)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="loginscreen-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="loginscreen-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : tab === 'login' ? (
                  <span>Masuk ke DIGESTA</span>
                ) : (
                  <span>Daftar Akun Baru</span>
                )}
              </button>
            </form>

            {/* Pemisah Antara Login Form & Tamu */}
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
              <span>🚀 Masuk sebagai Siswa Tamu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
