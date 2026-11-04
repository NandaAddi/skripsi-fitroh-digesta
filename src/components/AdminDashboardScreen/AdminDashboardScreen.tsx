import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, type QuizScoreRow } from '../../services/adminService';
import { supabaseConfig } from '../../services/supabaseClient';
import { playSound, isSoundEnabled } from '../../services/soundService';
import './AdminDashboardScreen.css';

export const AdminDashboardScreen: React.FC = () => {
  const navigate = useNavigate();

  // Autentikasi Sesi Guru / Admin
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => adminService.isAuthenticated());
  const [inputPin, setInputPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Data Nilai & Loading
  const [scores, setScores] = useState<QuizScoreRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter, Pencarian, & Pengurutan
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterKkm, setFilterKkm] = useState<'all' | 'passed' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'score_desc' | 'score_asc' | 'time_asc' | 'absen_asc'>('newest');

  // Modal Konfirmasi Hapus
  const [itemToDelete, setItemToDelete] = useState<QuizScoreRow | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetConfirmPin, setResetConfirmPin] = useState<string>('');
  const [resetError, setResetError] = useState<string>('');

  // Muat data saat sesi admin aktif
  useEffect(() => {
    if (!isAuthorized) return;
    let isMounted = true;

    adminService
      .getAllScores()
      .then((data) => {
        if (isMounted) {
          setScores(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthorized]);

  const handleManualRefresh = () => {
    playSound('pop', isSoundEnabled());
    setIsLoading(true);
    adminService
      .getAllScores()
      .then((data) => {
        setScores(data);
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

  // Hitung KPI Statistik Kelas
  const stats = useMemo(() => {
    return adminService.computeStatistics(scores, 75);
  }, [scores]);

  // Filter & Urutkan Data
  const filteredScores = useMemo(() => {
    let result = [...scores];

    // Pencarian nama atau nomor absen
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.studentName.toLowerCase().includes(q) ||
          s.attendanceNumber.toString().includes(q)
      );
    }

    // Filter KKM (75)
    if (filterKkm === 'passed') {
      result = result.filter((s) => s.score >= 75);
    } else if (filterKkm === 'failed') {
      result = result.filter((s) => s.score < 75);
    }

    // Pengurutan
    result.sort((a, b) => {
      switch (sortBy) {
        case 'score_desc':
          return b.score - a.score || a.durationSeconds - b.durationSeconds;
        case 'score_asc':
          return a.score - b.score || a.durationSeconds - b.durationSeconds;
        case 'time_asc':
          return a.durationSeconds - b.durationSeconds;
        case 'absen_asc':
          return a.attendanceNumber - b.attendanceNumber;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [scores, searchQuery, filterKkm, sortBy]);

  // Eksekusi Hapus 1 Baris Nilai
  const handleConfirmDeleteRow = async () => {
    if (!itemToDelete) return;
    playSound('pop', isSoundEnabled());
    const res = await adminService.deleteScore(itemToDelete.id);
    if (res.success) {
      setScores((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setItemToDelete(null);
    } else {
      alert('Gagal menghapus data: ' + res.error);
    }
  };

  // Eksekusi Reset Seluruh Nilai
  const handleConfirmResetAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminService.verifyPin(resetConfirmPin)) {
      playSound('error', isSoundEnabled());
      setResetError('PIN konfirmasi salah!');
      return;
    }

    playSound('success', isSoundEnabled());
    const res = await adminService.resetAllScores();
    if (res.success) {
      setScores([]);
      setShowResetModal(false);
      setResetConfirmPin('');
      setResetError('');
    } else {
      setResetError('Gagal mereset data: ' + res.error);
    }
  };

  // --------------------------------------------------------------------------
  // LAYAR 1: GERBANG MASUK PIN GURU (Jika Belum Terotorisasi)
  // --------------------------------------------------------------------------
  if (!isAuthorized) {
    return (
      <div className="admin-gate-viewport">
        <div className="admin-gate-card">
          <div className="admin-gate-badge">
            <span>AKSES KHUSUS GURU & ADMIN</span>
          </div>

          <div className="admin-gate-icon-wrapper">
            <svg viewBox="0 0 24 24" className="admin-gate-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="admin-gate-title">Dashboard Guru DIGESTA</h1>
          <p className="admin-gate-desc">
            Masukkan PIN Pengajar untuk membuka rekapitulasi nilai, statistik ketuntasan siswa, dan kelola data kuis.
          </p>

          <form onSubmit={handleVerifyPin} className="admin-gate-form">
            <div className="admin-pin-input-group">
              <input
                type="password"
                maxLength={12}
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
            <span>Default PIN: <code>123456</code> (Dapat diubah via berkas .env)</span>
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
          <h1 className="admin-brand-title">DIGESTA Kelas Pintar</h1>
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
              adminService.exportScoresToCsv(filteredScores, 75);
            }}
            title="Unduh rekapitulasi nilai dalam format CSV / Microsoft Excel"
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
        {/* KPI Cards: Statistik Kelas */}
        <section className="admin-kpi-grid">
          {/* Card 1: Total Siswa & Percobaan */}
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
              <span className="kpi-label">Siswa Mengerjakan</span>
              <div className="kpi-main-number">
                {stats.totalStudents} <span className="kpi-sub-text">Siswa</span>
              </div>
              <span className="kpi-note">{stats.totalAttempts} total percobaan kuis</span>
            </div>
          </div>

          {/* Card 2: Rata-Rata Nilai Kelas */}
          <div className="admin-kpi-card card-amber">
            <div className="kpi-icon-slot">
              <svg viewBox="0 0 24 24" className="kpi-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Rata-Rata Kelas</span>
              <div className="kpi-main-number">
                {stats.averageScore} <span className="kpi-sub-text">Poin</span>
              </div>
              <span className="kpi-note">Standar KKM 75 Poin</span>
            </div>
          </div>

          {/* Card 3: Ketuntasan Belajar KKM */}
          <div className="admin-kpi-card card-emerald">
            <div className="kpi-icon-slot">
              <svg viewBox="0 0 24 24" className="kpi-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Ketuntasan Siswa</span>
              <div className="kpi-main-number">
                {stats.passingRate}% <span className="kpi-sub-text">Tuntas</span>
              </div>
              <span className="kpi-note">{stats.passedCount} lulus / {stats.failedCount} belum</span>
            </div>
          </div>

          {/* Card 4: Rentang Skor Maksimum/Minimum */}
          <div className="admin-kpi-card card-purple">
            <div className="kpi-icon-slot">
              <svg viewBox="0 0 24 24" className="kpi-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Skor Tertinggi & Terendah</span>
              <div className="kpi-main-number">
                {stats.highestScore} <span className="kpi-sub-text">/ {stats.lowestScore}</span>
              </div>
              <span className="kpi-note">Rentang capaian siswa</span>
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
                className="admin-clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Hapus pencarian"
              >
                &times;
              </button>
            )}
          </div>

          <div className="admin-filter-group">
            <label className="admin-filter-label" htmlFor="filter-kkm">
              Status KKM:
            </label>
            <select
              id="filter-kkm"
              value={filterKkm}
              onChange={(e) => setFilterKkm(e.target.value as 'all' | 'passed' | 'failed')}
              className="admin-select"
            >
              <option value="all">Semua Status ({scores.length})</option>
              <option value="passed">Tuntas &ge; 75 ({stats.passedCount})</option>
              <option value="failed">Belum Tuntas &lt; 75 ({stats.failedCount})</option>
            </select>
          </div>

          <div className="admin-filter-group">
            <label className="admin-filter-label" htmlFor="sort-by">
              Urutkan:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'score_desc' | 'score_asc' | 'time_asc' | 'absen_asc')}
              className="admin-select"
            >
              <option value="newest">Percobaan Terbaru</option>
              <option value="score_desc">Nilai Tertinggi</option>
              <option value="score_asc">Nilai Terendah</option>
              <option value="time_asc">Durasi Tercepat</option>
              <option value="absen_asc">Nomor Absen (1-99)</option>
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

        {/* Tabel Rekapitulasi Data Siswa */}
        <section className="admin-table-card">
          <div className="admin-table-header-info">
            <h2 className="admin-table-title">Daftar Hasil Kuis Siswa</h2>
            <span className="admin-table-counter">
              Menampilkan {filteredScores.length} dari {scores.length} rekaman
            </span>
          </div>

          {isLoading ? (
            <div className="admin-table-loading">
              <div className="admin-spinner" />
              <span>Memuat data hasil tes...</span>
            </div>
          ) : filteredScores.length === 0 ? (
            <div className="admin-table-empty">
              <p>Tidak ditemukan data hasil tes yang sesuai dengan filter.</p>
            </div>
          ) : (
            <div className="admin-table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>No</th>
                    <th>Nama Lengkap Siswa</th>
                    <th style={{ width: '100px' }}>No. Absen</th>
                    <th style={{ width: '120px' }}>Nilai Akhir</th>
                    <th style={{ width: '130px' }}>Status KKM</th>
                    <th style={{ width: '120px' }}>Benar / Soal</th>
                    <th style={{ width: '110px' }}>Durasi</th>
                    <th style={{ width: '160px' }}>Tanggal & Waktu</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScores.map((row, idx) => {
                    const isPassed = row.score >= 75;
                    const dateFormatted = new Date(row.createdAt).toLocaleString('id-ID', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    });

                    return (
                      <tr key={row.id}>
                        <td className="cell-number">{idx + 1}</td>
                        <td className="cell-name">
                          <strong>{row.studentName}</strong>
                        </td>
                        <td className="cell-absen">
                          <span className="admin-absen-badge">Absen {row.attendanceNumber}</span>
                        </td>
                        <td className="cell-score">
                          <span className={`admin-score-text ${isPassed ? 'score-passed' : 'score-failed'}`}>
                            {row.score}
                          </span>
                        </td>
                        <td className="cell-kkm">
                          <span className={`admin-kkm-pill ${isPassed ? 'pill-passed' : 'pill-failed'}`}>
                            {isPassed ? 'Tuntas' : 'Belum Tuntas'}
                          </span>
                        </td>
                        <td className="cell-correct">
                          {row.correctCount} / {row.totalQuestions}
                        </td>
                        <td className="cell-duration">
                          {adminService.formatDuration(row.durationSeconds)}
                        </td>
                        <td className="cell-date">{dateFormatted}</td>
                        <td className="cell-actions">
                          <button
                            type="button"
                            className="admin-delete-row-btn"
                            onClick={() => setItemToDelete(row)}
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
      {/* MODAL 1: KONFIRMASI HAPUS 1 BARIS NILAI */}
      {/* -------------------------------------------------------------------------- */}
      {itemToDelete && (
        <div className="admin-modal-overlay" onClick={() => setItemToDelete(null)}>
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
              Apakah Anda yakin ingin menghapus rekaman kuis atas nama{' '}
              <strong>{itemToDelete.studentName}</strong> (Absen {itemToDelete.attendanceNumber}) dengan skor{' '}
              <strong>{itemToDelete.score} Poin</strong>?
            </p>

            <div className="admin-dialog-actions">
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={handleConfirmDeleteRow}
              >
                Ya, Hapus Data
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setItemToDelete(null)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL 2: KONFIRMASI RESET SELURUH DATA NILAI */}
      {/* -------------------------------------------------------------------------- */}
      {showResetModal && (
        <div className="admin-modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="admin-dialog-card danger-theme" onClick={(e) => e.stopPropagation()}>
            <div className="admin-dialog-badge reset-theme">
              <span>RESET SELURUH NILAI</span>
            </div>

            <div className="admin-dialog-icon-wrapper reset">
              <svg viewBox="0 0 24 24" className="admin-dialog-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h3 className="admin-dialog-title">Peringatan: Reset Total Data</h3>
            <p className="admin-dialog-desc">
              Tindakan ini akan <strong>menghapus permanen seluruh rekaman hasil kuis kelas</strong> di Supabase dan penyimpanan lokal. Masukkan PIN Guru Anda untuk melanjutkan:
            </p>

            <form onSubmit={handleConfirmResetAll} className="admin-reset-form">
              <input
                type="password"
                placeholder="Konfirmasi PIN Guru..."
                value={resetConfirmPin}
                onChange={(e) => {
                  setResetConfirmPin(e.target.value);
                  setResetError('');
                }}
                className="admin-pin-input"
                autoFocus
              />

              {resetError && <p className="admin-gate-error">{resetError}</p>}

              <div className="admin-dialog-actions">
                <button type="submit" className="admin-btn admin-btn-danger">
                  Hapus Semua Sekarang
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardScreen;
