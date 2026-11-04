import React, { useEffect, useState } from 'react';
import { quizService, type LeaderboardEntry } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';
import { playSound, isSoundEnabled } from '../../services/soundService';
import './LeaderboardModal.css';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    playSound('pop', isSoundEnabled());
    onClose();
  };

  const getRankBadgeClass = (rank?: number) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-standard';
  };

  return (
    <div className="leaderboard-overlay" onClick={handleClose} role="presentation">
      <div
        className="leaderboard-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leaderboard-title"
      >
        {/* Badge Plat Judul Timbul */}
        <div className="leaderboard-plate-badge">
          <span>PAPAN PERINGKAT KUIS</span>
        </div>

        {/* Tombol Tutup Silang di Sudut */}
        <button
          type="button"
          className="leaderboard-close-btn"
          onClick={handleClose}
          title="Tutup Papan Peringkat"
          aria-label="Tutup"
        >
          <svg viewBox="0 0 24 24" className="leaderboard-close-svg" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header Keterangan */}
        <div className="leaderboard-header-content">
          <div className="leaderboard-trophy-badge">
            <svg viewBox="0 0 24 24" className="leaderboard-trophy-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
              <path d="M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2Z" />
            </svg>
          </div>
          <h2 id="leaderboard-title" className="leaderboard-main-title">
            Top Prestasi Siswa DIGESTA
          </h2>
          <p className="leaderboard-subtitle">
            Urutan berdasarkan nilai tertinggi dan durasi pengerjaan tercepat
          </p>
        </div>

        {/* Kontainer Daftar Peringkat */}
        <div className="leaderboard-list-container">
          {isLoading ? (
            <div className="leaderboard-loading-state">
              <div className="leaderboard-spinner" />
              <span>Memuat data peringkat...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="leaderboard-empty-state">
              <p>Belum ada rekaman nilai. Jadilah yang pertama menyelesaikan kuis!</p>
            </div>
          ) : (
            <div className="leaderboard-items-scroll">
              {entries.map((entry) => {
                const isCurrentUser =
                  user &&
                  user.fullName.toLowerCase() === entry.studentName.toLowerCase() &&
                  user.attendanceNumber === entry.attendanceNumber;

                return (
                  <div
                    key={entry.id}
                    className={`leaderboard-row ${getRankBadgeClass(entry.rank)} ${isCurrentUser ? 'current-student-highlight' : ''}`}
                  >
                    {/* Badge Nomor Peringkat */}
                    <div className="leaderboard-rank-pill">
                      <span>#{entry.rank}</span>
                    </div>

                    {/* Informasi Siswa */}
                    <div className="leaderboard-student-info">
                      <div className="leaderboard-student-name">
                        <span>{entry.studentName}</span>
                        {isCurrentUser && <span className="leaderboard-you-badge">Kamu</span>}
                      </div>
                      <div className="leaderboard-student-meta">
                        <span className="leaderboard-meta-badge">Absen {entry.attendanceNumber}</span>
                        <span className="leaderboard-meta-time">
                          Waktu: {quizService.formatDuration(entry.durationSeconds)}
                        </span>
                      </div>
                    </div>

                    {/* Nilai / Poin */}
                    <div className="leaderboard-score-box">
                      <span className="leaderboard-score-number">{entry.score}</span>
                      <span className="leaderboard-score-label">Poin</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Tombol Tutup */}
        <div className="leaderboard-footer-actions">
          <button
            type="button"
            className="leaderboard-confirm-btn"
            onClick={handleClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
