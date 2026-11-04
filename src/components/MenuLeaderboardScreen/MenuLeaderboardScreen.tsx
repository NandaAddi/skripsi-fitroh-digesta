import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/kuis-screen/bg-kuis-screen.webp';
import btnHome from '../../assets/menu-materi-gangguan-pencernaan-screen/button-home.webp';
import { useAuth } from '../../context/AuthContext';
import { quizService, type LeaderboardEntry } from '../../services/quizService';
import { playSound, isSoundEnabled } from '../../services/soundService';
import './MenuLeaderboardScreen.css';

export const MenuLeaderboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadLeaderboard = () => {
    setIsLoading(true);
    quizService
      .getLeaderboard()
      .then((data) => {
        setEntries(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    quizService
      .getLeaderboard()
      .then((data) => {
        if (isMounted) {
          setEntries(data);
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
  }, []);

  const handleGoHome = () => {
    playSound('pop', isSoundEnabled());
    navigate('/menu');
  };

  const handleManualRefresh = () => {
    playSound('pop', isSoundEnabled());
    loadLeaderboard();
  };

  // Ambil Top 3 untuk Podium Juara
  const rank1 = entries[0] || null;
  const rank2 = entries[1] || null;
  const rank3 = entries[2] || null;

  return (
    <div className="lb-viewport">
      <div className="lb-stage">
        {/* Layer 1: Background Ruang Kelas Papan Tulis */}
        <img
          src={bgImg}
          alt="Latar Belakang Papan Peringkat"
          className="lb-bg"
          draggable={false}
        />

        {/* Layer 2: Bilah Navigasi Atas */}
        {/* Tombol Beranda (Kembali ke Menu Utama) */}
        <button
          type="button"
          className="lb-ctrl-btn lb-btn-home"
          onClick={handleGoHome}
          title="Kembali ke Menu Utama"
          aria-label="Kembali ke Menu Utama"
        >
          <img src={btnHome} alt="Beranda" className="lb-ctrl-img" draggable={false} />
        </button>

        {/* Badge Plat Judul Timbul Tengah */}
        <div className="lb-plate-title">
          <span>PAPAN PERINGKAT KUIS</span>
        </div>

        {/* Badge Info Siswa Aktif (Pojok Kanan Atas) */}
        <div className="lb-user-status-pill">
          <div className="lb-user-avatar">
            <svg viewBox="0 0 24 24" className="lb-user-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="lb-user-text">
            <span className="lb-user-name">{user?.fullName || 'Siswa DIGESTA'}</span>
            <span className="lb-user-sub">
              {user?.attendanceNumber ? `No. Absen ${user.attendanceNumber}` : 'Mode Tamu'}
            </span>
          </div>
        </div>

        {/* Layer 3: Konten Utama (Grid Kiri: Podium 3D, Kanan: Daftar Lengkap) */}
        <div className="lb-content-grid">
          {/* Kolom Kiri: Podium Tiga Terbaik (Top 3) */}
          <section className="lb-podium-card" aria-label="Tiga Siswa Terbaik Kuis">
            <div className="lb-podium-header">
              <h2 className="lb-podium-title">Podium Juara Kelas</h2>
              <p className="lb-podium-subtitle">Tiga peraih nilai tertinggi dengan durasi tercepat</p>
            </div>

            <div className="lb-podiums-row">
              {/* Podium Juara 2 (Perak) */}
              <div className="lb-podium-column rank-2">
                <div className="lb-podium-student-card">
                  <div className="lb-medal-icon silver">
                    <span>🥈</span>
                  </div>
                  <span className="lb-student-podium-name" title={rank2?.studentName || '-'}>
                    {rank2 ? rank2.studentName : 'Kosong'}
                  </span>
                  {rank2 && (
                    <div className="lb-student-podium-meta">
                      <span className="lb-podium-score">{rank2.score} Poin</span>
                      <span className="lb-podium-time">{quizService.formatDuration(rank2.durationSeconds)}</span>
                    </div>
                  )}
                </div>
                <div className="lb-podium-pedestal pedestal-silver">
                  <span className="lb-pedestal-num">2</span>
                  <span className="lb-pedestal-label">PERAK</span>
                </div>
              </div>

              {/* Podium Juara 1 (Emas - Tertinggi di Tengah) */}
              <div className="lb-podium-column rank-1">
                <div className="lb-crown-icon">
                  <svg viewBox="0 0 24 24" className="lb-crown-svg" fill="currentColor">
                    <path d="M2 4l3 12h14l3-12-5 7-5-7-5 7-5-7zm3 14h14v2H5v-2z" />
                  </svg>
                </div>
                <div className="lb-podium-student-card champ">
                  <div className="lb-medal-icon gold">
                    <span>🥇</span>
                  </div>
                  <span className="lb-student-podium-name" title={rank1?.studentName || '-'}>
                    {rank1 ? rank1.studentName : 'Belum Ada'}
                  </span>
                  {rank1 && (
                    <div className="lb-student-podium-meta">
                      <span className="lb-podium-score gold">{rank1.score} Poin</span>
                      <span className="lb-podium-time">{quizService.formatDuration(rank1.durationSeconds)}</span>
                    </div>
                  )}
                </div>
                <div className="lb-podium-pedestal pedestal-gold">
                  <span className="lb-pedestal-num">1</span>
                  <span className="lb-pedestal-label">JUARA 1</span>
                </div>
              </div>

              {/* Podium Juara 3 (Perunggu) */}
              <div className="lb-podium-column rank-3">
                <div className="lb-podium-student-card">
                  <div className="lb-medal-icon bronze">
                    <span>🥉</span>
                  </div>
                  <span className="lb-student-podium-name" title={rank3?.studentName || '-'}>
                    {rank3 ? rank3.studentName : 'Kosong'}
                  </span>
                  {rank3 && (
                    <div className="lb-student-podium-meta">
                      <span className="lb-podium-score">{rank3.score} Poin</span>
                      <span className="lb-podium-time">{quizService.formatDuration(rank3.durationSeconds)}</span>
                    </div>
                  )}
                </div>
                <div className="lb-podium-pedestal pedestal-bronze">
                  <span className="lb-pedestal-num">3</span>
                  <span className="lb-pedestal-label">PERUNGGU</span>
                </div>
              </div>
            </div>
          </section>

          {/* Kolom Kanan: Daftar Lengkap Peringkat Siswa */}
          <section className="lb-list-card" aria-label="Daftar Lengkap Peringkat Kuis">
            <div className="lb-list-header">
              <div className="lb-list-header-left">
                <h2 className="lb-list-title">Semua Peringkat Siswa</h2>
                <span className="lb-list-count">{entries.length} Siswa Terdaftar</span>
              </div>
              <button
                type="button"
                className="lb-refresh-btn"
                onClick={handleManualRefresh}
                title="Segarkan data peringkat terbaru"
              >
                <svg viewBox="0 0 24 24" className="lb-refresh-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                <span>Segarkan</span>
              </button>
            </div>

            {/* Area Daftar Scrollable */}
            <div className="lb-scroll-container">
              {isLoading ? (
                <div className="lb-loading-box">
                  <div className="lb-spinner" />
                  <span>Memuat peringkat siswa...</span>
                </div>
              ) : entries.length === 0 ? (
                <div className="lb-empty-box">
                  <p>Belum ada siswa yang menyelesaikan kuis. Mulai kuis untuk menjadi yang pertama!</p>
                </div>
              ) : (
                <div className="lb-rows-scroll">
                  {entries.map((item) => {
                    const isCurrentUser =
                      user &&
                      user.fullName.trim().toUpperCase() === item.studentName.trim().toUpperCase() &&
                      user.attendanceNumber === item.attendanceNumber;

                    const getRankStyle = (rank?: number) => {
                      if (rank === 1) return 'rank-row-gold';
                      if (rank === 2) return 'rank-row-silver';
                      if (rank === 3) return 'rank-row-bronze';
                      return 'rank-row-normal';
                    };

                    return (
                      <div
                        key={item.id}
                        className={`lb-student-row ${getRankStyle(item.rank)} ${isCurrentUser ? 'is-current-user' : ''}`}
                      >
                        {/* Nomor Peringkat */}
                        <div className="lb-rank-badge">
                          <span>#{item.rank}</span>
                        </div>

                        {/* Nama & Nomor Absen */}
                        <div className="lb-student-details">
                          <div className="lb-name-wrapper">
                            <span className="lb-student-fullname">{item.studentName}</span>
                            {isCurrentUser && <span className="lb-you-tag">Kamu</span>}
                          </div>
                          <div className="lb-meta-wrapper">
                            <span className="lb-absen-tag">Absen {item.attendanceNumber}</span>
                            <span className="lb-time-tag">
                              Waktu: {quizService.formatDuration(item.durationSeconds)}
                            </span>
                          </div>
                        </div>

                        {/* Nilai Akhir */}
                        <div className="lb-score-column">
                          <span className="lb-score-digits">{item.score}</span>
                          <span className="lb-score-unit">Poin</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MenuLeaderboardScreen;
