import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, type StudentEvaluationRow } from '../../services/adminService';
import { quizService, type QuizSettings } from '../../services/quizService';
import { supabaseConfig } from '../../services/supabaseClient';
import { playSound, isSoundEnabled } from '../../services/soundService';
import './AdminDashboardScreen.css';

export const AdminDashboardScreen: React.FC = () => {
  const navigate = useNavigate();

  // Autentikasi Sesi Guru / Admin
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => adminService.isAuthenticated());
  const [inputPin, setInputPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Data Evaluasi Siswa & Pengaturan Kuis
  const [evaluations, setEvaluations] = useState<StudentEvaluationRow[]>([]);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    preTestOpen: true,
    postTestOpen: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState<boolean>(false);

  // Filter, Pencarian, & Pengurutan
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed' | 'incomplete'>('all');
  const [sortBy, setSortBy] = useState<'absen_asc' | 'gain_desc' | 'post_desc' | 'pre_desc' | 'name_asc'>('absen_asc');

  // Modal Konfirmasi Hapus Siswa & Reset Data
  const [studentToDelete, setStudentToDelete] = useState<StudentEvaluationRow | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetConfirmPin, setResetConfirmPin] = useState<string>('');
  const [resetError, setResetError] = useState<string>('');

  // Muat data saat sesi admin aktif
  useEffect(() => {
    if (!isAuthorized) return;
    let isMounted = true;

    Promise.all([adminService.getStudentEvaluations(), quizService.getQuizSettings()])
      .then(([evalData, settingsData]) => {
        if (isMounted) {
          setEvaluations(evalData);
          setQuizSettings(settingsData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[DIGESTA Admin] Gagal memuat data:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthorized]);

  const handleManualRefresh = () => {
    playSound('pop', isSoundEnabled());
    setIsLoading(true);
    Promise.all([adminService.getStudentEvaluations(), quizService.getQuizSettings()])
      .then(([evalData, settingsData]) => {
        setEvaluations(evalData);
        setQuizSettings(settingsData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminService.verifyPin(inputPin)) {
      playSound('success', isSoundEnabled());
      adminService.setAuthenticated(true);
      setIsAuthorized(true);
      setPinError('');
      setInputPin('');
    } else {
      playSound('error', isSoundEnabled());
      setPinError('PIN salah! Silakan periksa kembali PIN Guru Anda.');
    }
  };

  const handleLogoutAdmin = () => {
    playSound('pop', isSoundEnabled());
    adminService.setAuthenticated(false);
    setIsAuthorized(false);
  };

  // Toggle Status Buka/Kunci Kuis Siswa
  const handleToggleQuizSetting = async (target: 'pre' | 'post') => {
    playSound('pop', isSoundEnabled());
    const nextSettings: QuizSettings = {
      ...quizSettings,
      preTestOpen: target === 'pre' ? !quizSettings.preTestOpen : quizSettings.preTestOpen,
      postTestOpen: target === 'post' ? !quizSettings.postTestOpen : quizSettings.postTestOpen,
    };

    setIsUpdatingSettings(true);
    setQuizSettings(nextSettings);

    const res = await quizService.updateQuizSettings(nextSettings);
    setIsUpdatingSettings(false);

    if (res.success) {
      playSound('chime', isSoundEnabled());
    } else {
      playSound('error', isSoundEnabled());
      alert('Gagal memperbarui status kuis: ' + res.error);
    }
  };

  // Hitung Statistik Kelas
  const stats = useMemo(() => {
    return adminService.computeStatistics(evaluations, 75);
  }, [evaluations]);

  // Filter & Urutkan Data Evaluasi
  const filteredEvaluations = useMemo(() => {
    let result = [...evaluations];

    // Pencarian nama atau nomor absen
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.studentName.toLowerCase().includes(q) ||
          item.attendanceNumber.toString() === q
      );
    }

    // Filter status KKM Post-Test
    if (filterStatus === 'passed') {
      result = result.filter((item) => item.postTestScore !== null && item.postTestScore >= 75);
    } else if (filterStatus === 'failed') {
      result = result.filter((item) => item.postTestScore !== null && item.postTestScore < 75);
    } else if (filterStatus === 'incomplete') {
      result = result.filter((item) => item.postTestScore === null || item.preTestScore === null);
    }

    // Pengurutan
    result.sort((a, b) => {
      switch (sortBy) {
        case 'absen_asc':
          return a.attendanceNumber - b.attendanceNumber;
        case 'gain_desc':
          return (b.gain ?? -999) - (a.gain ?? -999);
        case 'post_desc':
          return (b.postTestScore ?? -1) - (a.postTestScore ?? -1);
        case 'pre_desc':
          return (b.preTestScore ?? -1) - (a.preTestScore ?? -1);
        case 'name_asc':
          return a.studentName.localeCompare(b.studentName);
        default:
          return a.attendanceNumber - b.attendanceNumber;
      }
    });

    return result;
  }, [evaluations, searchQuery, filterStatus, sortBy]);

  // Konfirmasi Hapus Rekaman Siswa
  const handleConfirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    playSound('pop', isSoundEnabled());
    const res = await adminService.deleteStudentScores(
      studentToDelete.studentName,
      studentToDelete.attendanceNumber
    );

    if (res.success) {
      playSound('chime', isSoundEnabled());
      setEvaluations((prev) =>
        prev.filter((item) => item.studentKey !== studentToDelete.studentKey)
      );
      setStudentToDelete(null);
    } else {
      playSound('error', isSoundEnabled());
      alert('Gagal menghapus nilai siswa: ' + res.error);
    }
  };

  // Konfirmasi Reset Seluruh Data Nilai
  const handleConfirmResetAll = async () => {
    if (!adminService.verifyPin(resetConfirmPin)) {
      playSound('error', isSoundEnabled());
      setResetError('PIN konfirmasi salah! Data tidak direset.');
      return;
    }

    playSound('pop', isSoundEnabled());
    const res = await adminService.resetAllScores();
    if (res.success) {
      playSound('chime', isSoundEnabled());
      setEvaluations([]);
      setShowResetModal(false);
      setResetConfirmPin('');
      setResetError('');
    } else {
      playSound('error', isSoundEnabled());
      setResetError(res.error || 'Gagal mereset data database');
    }
  };

  // --------------------------------------------------------------------------
  // LAYAR 1: GERBANG MASUK PIN GURU (Jika Belum Login Admin)
  // --------------------------------------------------------------------------
  if (!isAuthorized) {
    return (
      <div className="admin-gate-viewport">
        <div className="admin-gate-card">
          <div className="admin-gate-badge">
            <span>AREA GURU / ADMIN</span>
          </div>

          <div className="admin-gate-icon-wrapper">
            <svg viewBox="0 0 24 24" className="admin-gate-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 className="admin-gate-title">Autentikasi Guru DIGESTA</h2>
          <p className="admin-gate-subtitle">
            Masukkan PIN Pengajar untuk membuka Command Center dan mengelola evaluasi Pre-Test & Post-Test siswa.
          </p>

          <form onSubmit={handleVerifyPin} className="admin-gate-form">
            <div className="admin-gate-input-wrapper">
              <input
                type="password"
                maxLength={10}
                value={inputPin}
                onChange={(e) => {
                  setInputPin(e.target.value);
                  setPinError('');
                }}
                placeholder="Masukkan PIN Guru..."
                className="admin-pin-input"
                autoFocus
              />
            </div>

            {pinError && <p className="admin-gate-error">{pinError}</p>}

            <div className="admin-gate-actions">
              <button type="submit" className="admin-btn admin-btn-primary">
                Buka Dashboard
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  playSound('pop', isSoundEnabled());
                  navigate('/menu');
                }}
              >
                Kembali ke Menu
              </button>
            </div>
          </form>

          <div className="admin-gate-footer-hint">
            <span>Default PIN: <code>123456</code> (Dapat diatur via file .env)</span>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // LAYAR 2: DASHBOARD ADMIN UTAMA (Classroom Command Center)
  // --------------------------------------------------------------------------
  return (
    <div className="admin-dashboard-container">
      {/* Header Bilah Atas */}
      <header className="admin-topbar">
        <div className="admin-brand-section">
          <div className="admin-brand-badge">
            <span>COMMAND CENTER GURU</span>
          </div>
          <h1 className="admin-brand-title">DIGESTA Evaluasi Belajar</h1>
          <div className="admin-status-pill">
            <span className={`admin-status-dot ${supabaseConfig.isConfigured() ? 'live' : 'local'}`} />
            <span>{supabaseConfig.isConfigured() ? 'Database Supabase Terhubung' : 'Penyimpanan Offline Lokal'}</span>
          </div>
        </div>

        <div className="admin-topbar-actions">
          <button
            type="button"
            className="admin-action-btn btn-export"
            onClick={() => {
              playSound('chime', isSoundEnabled());
              adminService.exportScoresToCsv(filteredEvaluations, 75);
            }}
            title="Unduh rekapitulasi nilai Pre-Test & Post-Test dalam format CSV / Excel"
          >
            <svg viewBox="0 0 24 24" className="admin-btn-icon" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Ekspor CSV (Excel)</span>
          </button>

          <button
            type="button"
            className="admin-action-btn btn-reset"
            onClick={() => {
              playSound('pop', isSoundEnabled());
              setShowResetModal(true);
            }}
            title="Reset seluruh hasil kuis siswa"
          >
            <svg viewBox="0 0 24 24" className="admin-btn-icon" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Reset Data</span>
          </button>

          <button
            type="button"
            className="admin-action-btn btn-nav"
            onClick={() => {
              playSound('pop', isSoundEnabled());
              navigate('/menu');
            }}
          >
            <span>Aplikasi Siswa</span>
          </button>

          <button
            type="button"
            className="admin-action-btn btn-logout"
            onClick={handleLogoutAdmin}
            title="Kunci sesi admin"
          >
            <span>Kunci Admin</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-body">
        {/* PANEL KONTROL BUKA / KUNCI KUIS GURU */}
        <section className="admin-quiz-control-panel">
          <div className="admin-control-header">
            <div className="admin-control-title-box">
              <svg viewBox="0 0 24 24" className="admin-control-icon" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div>
                <h2 className="admin-control-title">Kontrol Akses Kuis Siswa</h2>
                <p className="admin-control-subtitle">
                  Atur ketersediaan soal secara real-time. Siswa yang telah mengerjakan tidak dapat mengulang kuis.
                </p>
              </div>
            </div>
          </div>

          <div className="admin-switches-grid">
            {/* Switch Pre-Test */}
            <div className={`admin-switch-card ${quizSettings.preTestOpen ? 'card-is-open' : 'card-is-locked'}`}>
              <div className="switch-card-info">
                <span className="switch-card-badge tag-pre">TAHAP 1</span>
                <span className="switch-card-name">Pre-Test (Evaluasi Awal)</span>
                <span className="switch-card-desc">Dikerjakan siswa sebelum mempelajari materi</span>
              </div>
              <button
                type="button"
                className={`admin-toggle-btn ${quizSettings.preTestOpen ? 'is-open' : 'is-closed'}`}
                onClick={() => handleToggleQuizSetting('pre')}
                disabled={isUpdatingSettings}
                title={quizSettings.preTestOpen ? 'Klik untuk MENGUNCI Pre-Test' : 'Klik untuk MEMBUKA Pre-Test'}
              >
                <span className="toggle-indicator" />
                <span>{quizSettings.preTestOpen ? 'DIBUKA' : 'DIKUNCI'}</span>
              </button>
            </div>

            {/* Switch Post-Test */}
            <div className={`admin-switch-card ${quizSettings.postTestOpen ? 'card-is-open' : 'card-is-locked'}`}>
              <div className="switch-card-info">
                <span className="switch-card-badge tag-post">TAHAP 2</span>
                <span className="switch-card-name">Post-Test (Evaluasi Akhir)</span>
                <span className="switch-card-desc">Dibuka setelah siswa selesai mempelajari materi</span>
              </div>
              <button
                type="button"
                className={`admin-toggle-btn ${quizSettings.postTestOpen ? 'is-open' : 'is-closed'}`}
                onClick={() => handleToggleQuizSetting('post')}
                disabled={isUpdatingSettings}
                title={quizSettings.postTestOpen ? 'Klik untuk MENGUNCI Post-Test' : 'Klik untuk MEMBUKA Post-Test'}
              >
                <span className="toggle-indicator" />
                <span>{quizSettings.postTestOpen ? 'DIBUKA' : 'DIKUNCI'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* KPI Cards: Statistik Kelas */}
        <section className="admin-kpi-grid">
          {/* Card 1: Total Siswa */}
          <div className="admin-kpi-card card-blue">
            <div className="kpi-icon-slot">
              <svg viewBox="0 0 24 24" className="kpi-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Siswa Terdaftar</span>
              <div className="kpi-main-number">
                {stats.totalStudents} <span className="kpi-sub-text">Siswa</span>
              </div>
              <span className="kpi-note">Mengikuti evaluasi kuis</span>
            </div>
          </div>

          {/* Card 2: Rata-Rata Pre-Test */}
          <div className="admin-kpi-card card-cyan">
            <div className="kpi-icon-slot">
              <svg viewBox="0 0 24 24" className="kpi-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Rata-Rata Pre-Test</span>
              <div className="kpi-main-number">
                {stats.avgPreScore} <span className="kpi-sub-text">Poin</span>
              </div>
              <span className="kpi-note">Pemahaman awal sebelum materi</span>
            </div>
          </div>

          {/* Card 3: Rata-Rata Post-Test */}
          <div className="admin-kpi-card card-amber">
            <div className="kpi-icon-slot">
              <svg viewBox="0 0 24 24" className="kpi-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Rata-Rata Post-Test</span>
              <div className="kpi-main-number">
                {stats.avgPostScore} <span className="kpi-sub-text">Poin</span>
              </div>
              <span className="kpi-note">Capaian setelah materi</span>
            </div>
          </div>

          {/* Card 4: Rata-Rata Peningkatan (Gain) */}
          <div className="admin-kpi-card card-emerald">
            <div className="kpi-icon-slot">
              <svg viewBox="0 0 24 24" className="kpi-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Peningkatan Nilai (Gain)</span>
              <div className="kpi-main-number">
                {stats.avgGain > 0 ? `+${stats.avgGain}` : `${stats.avgGain}`} <span className="kpi-sub-text">Poin</span>
              </div>
              <span className="kpi-note">Efektivitas media DIGESTA</span>
            </div>
          </div>

          {/* Card 5: Ketuntasan Belajar KKM Post-Test */}
          <div className="admin-kpi-card card-purple">
            <div className="kpi-icon-slot">
              <svg viewBox="0 0 24 24" className="kpi-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Ketuntasan KKM (75)</span>
              <div className="kpi-main-number">
                {stats.passingRate}% <span className="kpi-sub-text">Tuntas</span>
              </div>
              <span className="kpi-note">{stats.passedCount} tuntas / {stats.failedCount} belum</span>
            </div>
          </div>
        </section>

        {/* Kontrol Filter, Pencarian, & Penyegaran */}
        <section className="admin-control-bar">
          <div className="admin-search-wrapper">
            <svg viewBox="0 0 24 24" className="admin-search-icon" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama siswa atau no. absen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="admin-search-clear"
                onClick={() => setSearchQuery('')}
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          <div className="admin-filter-group">
            <label htmlFor="filter-status" className="admin-filter-label">Status Post-Test:</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'passed' | 'failed' | 'incomplete')}
              className="admin-select"
            >
              <option value="all">Semua Siswa</option>
              <option value="passed">Tuntas KKM (&ge; 75)</option>
              <option value="failed">Belum Tuntas (&lt; 75)</option>
              <option value="incomplete">Belum Lengkap</option>
            </select>
          </div>

          <div className="admin-filter-group">
            <label htmlFor="sort-by" className="admin-filter-label">Urutkan:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'absen_asc' | 'gain_desc' | 'post_desc' | 'pre_desc' | 'name_asc')}
              className="admin-select"
            >
              <option value="absen_asc">Nomor Absen (1-99)</option>
              <option value="gain_desc">Peningkatan Tertinggi (Gain)</option>
              <option value="post_desc">Nilai Post-Test Tertinggi</option>
              <option value="pre_desc">Nilai Pre-Test Tertinggi</option>
              <option value="name_asc">Nama Siswa (A-Z)</option>
            </select>
          </div>

          <button
            type="button"
            className="admin-refresh-btn"
            onClick={handleManualRefresh}
            title="Muat ulang data terbaru"
          >
            <svg viewBox="0 0 24 24" className="admin-refresh-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>Segarkan</span>
          </button>
        </section>

        {/* Tabel Rekapitulasi Data Siswa (1 Baris per Siswa Berdampingan) */}
        <section className="admin-table-card">
          <div className="admin-table-header-info">
            <h2 className="admin-table-title">Rekapitulasi Evaluasi Belajar Siswa</h2>
            <span className="admin-table-counter">
              Menampilkan {filteredEvaluations.length} dari {evaluations.length} siswa
            </span>
          </div>

          {isLoading ? (
            <div className="admin-table-loading">
              <div className="admin-spinner" />
              <span>Memuat data hasil tes siswa...</span>
            </div>
          ) : filteredEvaluations.length === 0 ? (
            <div className="admin-table-empty">
              <p>Tidak ditemukan data evaluasi yang sesuai dengan pencarian.</p>
            </div>
          ) : (
            <div className="admin-table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '55px' }}>No</th>
                    <th style={{ width: '95px' }}>No. Absen</th>
                    <th>Nama Lengkap Siswa</th>
                    <th style={{ width: '130px', textAlign: 'center' }}>Pre-Test</th>
                    <th style={{ width: '130px', textAlign: 'center' }}>Post-Test</th>
                    <th style={{ width: '140px', textAlign: 'center' }}>Peningkatan (Gain)</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Status KKM</th>
                    <th style={{ width: '150px' }}>Tanggal Terakhir</th>
                    <th style={{ width: '75px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvaluations.map((row, idx) => {
                    const isPassed = row.postTestScore !== null && row.postTestScore >= 75;
                    const dateFormatted = new Date(row.lastDate).toLocaleString('id-ID', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    });

                    return (
                      <tr key={row.studentKey}>
                        <td className="cell-number">{idx + 1}</td>
                        <td className="cell-absen">
                          <span className="admin-absen-badge">Absen {row.attendanceNumber}</span>
                        </td>
                        <td className="cell-name">
                          <strong>{row.studentName}</strong>
                        </td>
                        
                        {/* Nilai Pre-Test */}
                        <td className="cell-test-pre" style={{ textAlign: 'center' }}>
                          {row.preTestScore !== null ? (
                            <div className="test-score-box">
                              <span className="score-val-pre">{row.preTestScore}</span>
                              <span className="score-sub-time">
                                {row.preTestDuration !== null ? adminService.formatDuration(row.preTestDuration) : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="test-not-yet">Belum Mengerjakan</span>
                          )}
                        </td>

                        {/* Nilai Post-Test */}
                        <td className="cell-test-post" style={{ textAlign: 'center' }}>
                          {row.postTestScore !== null ? (
                            <div className="test-score-box">
                              <span className={`score-val-post ${isPassed ? 'text-passed' : 'text-failed'}`}>
                                {row.postTestScore}
                              </span>
                              <span className="score-sub-time">
                                {row.postTestDuration !== null ? adminService.formatDuration(row.postTestDuration) : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="test-not-yet">Belum Mengerjakan</span>
                          )}
                        </td>

                        {/* Peningkatan Nilai (Gain) */}
                        <td className="cell-gain" style={{ textAlign: 'center' }}>
                          {row.gain !== null ? (
                            <span
                              className={`admin-gain-pill ${
                                row.gain > 0
                                  ? 'gain-positive'
                                  : row.gain === 0
                                    ? 'gain-neutral'
                                    : 'gain-negative'
                              }`}
                            >
                              {row.gain > 0 ? `+${row.gain}` : `${row.gain}`} Poin
                            </span>
                          ) : (
                            <span className="admin-gain-pill gain-pending">-</span>
                          )}
                        </td>

                        {/* Status KKM Post-Test */}
                        <td className="cell-kkm" style={{ textAlign: 'center' }}>
                          {row.postTestScore !== null ? (
                            <span className={`admin-kkm-pill ${isPassed ? 'pill-passed' : 'pill-failed'}`}>
                              {isPassed ? 'Tuntas' : 'Belum Tuntas'}
                            </span>
                          ) : (
                            <span className="test-not-yet">-</span>
                          )}
                        </td>

                        <td className="cell-date">{dateFormatted}</td>
                        <td className="cell-actions">
                          <button
                            type="button"
                            className="admin-delete-row-btn"
                            onClick={() => setStudentToDelete(row)}
                            title={`Hapus rekaman nilai ${row.studentName}`}
                          >
                            <svg viewBox="0 0 24 24" className="admin-trash-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 1: KONFIRMASI HAPUS REKAMAN SISWA */}
      {/* -------------------------------------------------------------------------- */}
      {studentToDelete && (
        <div className="admin-modal-overlay" onClick={() => setStudentToDelete(null)}>
          <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-dialog-badge delete-theme">
              <span>KONFIRMASI HAPUS</span>
            </div>

            <div className="admin-dialog-icon-wrapper delete">
              <svg viewBox="0 0 24 24" className="admin-dialog-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            <h3 className="admin-dialog-title">Hapus Nilai Siswa?</h3>
            <p className="admin-dialog-desc">
              Apakah Anda yakin ingin menghapus seluruh rekaman nilai kuis atas nama{' '}
              <strong>{studentToDelete.studentName}</strong> (Absen {studentToDelete.attendanceNumber})?
              Siswa akan dapat mengulang kuis kembali setelah datanya dihapus.
            </p>

            <div className="admin-dialog-actions">
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={handleConfirmDeleteStudent}
              >
                Ya, Hapus Data
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setStudentToDelete(null)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 2: KONFIRMASI RESET KESELURUHAN DATA */}
      {/* -------------------------------------------------------------------------- */}
      {showResetModal && (
        <div className="admin-modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="admin-dialog-card danger-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-dialog-badge danger-theme">
              <span>RESET KESELURUHAN</span>
            </div>

            <div className="admin-dialog-icon-wrapper danger">
              <svg viewBox="0 0 24 24" className="admin-dialog-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h3 className="admin-dialog-title">Peringatan: Reset Seluruh Nilai!</h3>
            <p className="admin-dialog-desc">
              Tindakan ini akan <strong>menghapus permanen seluruh nilai Pre-Test dan Post-Test</strong> semua siswa dari database.
              Untuk melanjutkan, masukkan PIN Guru Anda:
            </p>

            <div className="admin-dialog-pin-wrapper">
              <input
                type="password"
                maxLength={10}
                placeholder="Masukkan PIN Guru..."
                value={resetConfirmPin}
                onChange={(e) => {
                  setResetConfirmPin(e.target.value);
                  setResetError('');
                }}
                className="admin-pin-input"
                autoFocus
              />
            </div>

            {resetError && <p className="admin-dialog-error">{resetError}</p>}

            <div className="admin-dialog-actions">
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={handleConfirmResetAll}
              >
                Reset Sekarang
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmPin('');
                  setResetError('');
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardScreen;
