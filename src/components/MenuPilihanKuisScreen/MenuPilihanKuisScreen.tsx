import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/kuis-screen/bg-kuis-screen.webp';
import btnHome from '../../assets/petunjuk-penggunaan-screen/button-home.webp';
import { useAuth } from '../../context/AuthContext';
import {
  quizService,
  type QuizSettings,
  type StudentQuizStatus,
} from '../../services/quizService';
import { playSound as playSoundEffect, isSoundEnabled } from '../../services/soundService';
import './MenuPilihanKuisScreen.css';

export const MenuPilihanKuisScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const stageRef = useRef<HTMLDivElement>(null);
  const [soundEnabled] = useState(() => isSoundEnabled());

  const [settings, setSettings] = useState<QuizSettings>({
    preTestOpen: true,
    postTestOpen: false,
  });

  const [studentStatus, setStudentStatus] = useState<StudentQuizStatus>({
    preTestCompleted: false,
    preTestScore: null,
    preTestDuration: null,
    postTestCompleted: false,
    postTestScore: null,
    postTestDuration: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const playSound = (type: 'pop' | 'chime' | 'soft' | 'error') => {
    playSoundEffect(type, soundEnabled);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [fetchedSettings, fetchedStatus] = await Promise.all([
          quizService.getQuizSettings(),
          quizService.getStudentQuizStatus(
            user?.fullName || '',
            user?.attendanceNumber
          ),
        ]);

        if (isMounted) {
          setSettings(fetchedSettings);
          setStudentStatus(fetchedStatus);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('[DIGESTA Pilihan Kuis] Gagal memuat status kuis:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleGoHome = () => {
    playSound('pop');
    navigate('/menu');
  };

  const handleStartTest = (type: 'pre_test' | 'post_test') => {
    if (type === 'pre_test') {
      if (!settings.preTestOpen) {
        playSound('error');
        setNoticeMessage('Pre-Test saat ini sedang dikunci oleh Guru.');
        return;
      }
      if (studentStatus.preTestCompleted) {
        playSound('soft');
        setNoticeMessage(`Kamu sudah menyelesaikan Pre-Test dengan nilai ${studentStatus.preTestScore} poin. Soal tidak dapat diulang.`);
        return;
      }
      playSound('chime');
      navigate('/menu/kuis/play?type=pre_test');
    } else {
      if (!settings.postTestOpen) {
        playSound('error');
        setNoticeMessage('Post-Test belum dibuka oleh Guru. Pelajari materi terlebih dahulu ya!');
        return;
      }
      if (studentStatus.postTestCompleted) {
        playSound('soft');
        setNoticeMessage(`Kamu sudah menyelesaikan Post-Test dengan nilai ${studentStatus.postTestScore} poin. Soal tidak dapat diulang.`);
        return;
      }
      playSound('chime');
      navigate('/menu/kuis/play?type=post_test');
    }
  };

  return (
    <div className="pilihan-kuis-viewport">
      <div className="pilihan-kuis-stage" ref={stageRef}>
        {/* Layer 1: Background Ruang Kelas DIGESTA */}
        <img
          src={bgImg}
          alt="Latar Belakang Pilihan Kuis DIGESTA"
          className="pilihan-kuis-bg"
          draggable={false}
        />

        {/* Tombol Home di Pojok Kiri Atas */}
        <button
          type="button"
          className="pilihan-kuis-btn-home"
          onClick={handleGoHome}
          title="Kembali ke Menu Utama"
          aria-label="Kembali ke Menu Utama"
        >
          <img src={btnHome} alt="Beranda" className="pilihan-kuis-btn-img" draggable={false} />
        </button>

        {/* Wadah Papan Tulis Evaluasi */}
        <div className="pilihan-kuis-board">
          {/* Header Papan Tulis */}
          <div className="pilihan-kuis-header">
            <div className="pilihan-kuis-plate-badge">
              <span>EVALUASI PEMBELAJARAN</span>
            </div>
            <h1 className="pilihan-kuis-title">Pilih Jenis Kuis DIGESTA</h1>
            <p className="pilihan-kuis-subtitle">
              Ukur pemahaman sistem pencernaan sebelum (Pre-Test) dan sesudah (Post-Test) pembelajaran
            </p>
          </div>

          {/* Notifikasi Toast Jika Terkunci / Selesai */}
          {noticeMessage && (
            <div className="pilihan-kuis-toast-alert" role="alert">
              <span>{noticeMessage}</span>
              <button
                type="button"
                className="pilihan-kuis-toast-close"
                onClick={() => setNoticeMessage(null)}
                aria-label="Tutup notifikasi"
              >
                ✕
              </button>
            </div>
          )}

          {/* Kontainer 2 Kartu Game 3D: Pre-Test & Post-Test */}
          <div className="pilihan-kuis-cards-grid">
            {/* Kartu 1: PRE-TEST */}
            <div
              className={`pilihan-card-item pilihan-card-pretest ${
                studentStatus.preTestCompleted ? 'is-completed' : !settings.preTestOpen ? 'is-locked' : 'is-ready'
              }`}
            >
              <div className="pilihan-card-badge-header">
                <span className="pilihan-type-tag tag-pretest">TAHAP 1</span>
                {studentStatus.preTestCompleted ? (
                  <span className="pilihan-status-pill status-done">SELESAI</span>
                ) : !settings.preTestOpen ? (
                  <span className="pilihan-status-pill status-locked">TERKUNCI</span>
                ) : (
                  <span className="pilihan-status-pill status-ready">TERSEDIA</span>
                )}
              </div>

              <div className="pilihan-card-icon-box">
                <svg viewBox="0 0 24 24" className="pilihan-card-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                  <path d="M6 14h6" />
                </svg>
              </div>

              <h2 className="pilihan-card-title">Pre-Test (Uji Awal)</h2>
              <p className="pilihan-card-desc">
                Dikerjakan <strong>SEBELUM</strong> mempelajari materi untuk mengukur pengetahuan awalmu tentang sistem pencernaan.
              </p>

              <div className="pilihan-card-meta-box">
                {studentStatus.preTestCompleted ? (
                  <div className="pilihan-score-badge">
                    <span className="pilihan-score-val">{studentStatus.preTestScore}</span>
                    <span className="pilihan-score-unit">Poin (Terkunci)</span>
                  </div>
                ) : (
                  <div className="pilihan-info-badge">
                    <span>20 Soal Pilihan Ganda</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`pilihan-btn-action ${
                  studentStatus.preTestCompleted ? 'btn-done' : !settings.preTestOpen ? 'btn-disabled' : 'btn-pretest'
                }`}
                onClick={() => handleStartTest('pre_test')}
                disabled={isLoading}
              >
                {studentStatus.preTestCompleted
                  ? 'Kuis Selesai'
                  : !settings.preTestOpen
                    ? 'Belum Dibuka Guru'
                    : 'Mulai Pre-Test'}
              </button>
            </div>

            {/* Kartu 2: POST-TEST */}
            <div
              className={`pilihan-card-item pilihan-card-posttest ${
                studentStatus.postTestCompleted ? 'is-completed' : !settings.postTestOpen ? 'is-locked' : 'is-ready'
              }`}
            >
              <div className="pilihan-card-badge-header">
                <span className="pilihan-type-tag tag-posttest">TAHAP 2</span>
                {studentStatus.postTestCompleted ? (
                  <span className="pilihan-status-pill status-done">SELESAI</span>
                ) : !settings.postTestOpen ? (
                  <span className="pilihan-status-pill status-locked">TERKUNCI</span>
                ) : (
                  <span className="pilihan-status-pill status-ready">TERSEDIA</span>
                )}
              </div>

              <div className="pilihan-card-icon-box">
                <svg viewBox="0 0 24 24" className="pilihan-card-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>

              <h2 className="pilihan-card-title">Post-Test (Uji Akhir)</h2>
              <p className="pilihan-card-desc">
                Dikerjakan <strong>SETELAH</strong> mempelajari materi untuk mengevaluasi peningkatan pemahaman dan hasil belajarmu.
              </p>

              <div className="pilihan-card-meta-box">
                {studentStatus.postTestCompleted ? (
                  <div className="pilihan-score-badge">
                    <span className="pilihan-score-val">{studentStatus.postTestScore}</span>
                    <span className="pilihan-score-unit">Poin (Terkunci)</span>
                  </div>
                ) : (
                  <div className="pilihan-info-badge">
                    <span>20 Soal Evaluasi Akhir</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`pilihan-btn-action ${
                  studentStatus.postTestCompleted ? 'btn-done' : !settings.postTestOpen ? 'btn-disabled' : 'btn-posttest'
                }`}
                onClick={() => handleStartTest('post_test')}
                disabled={isLoading}
              >
                {studentStatus.postTestCompleted
                  ? 'Kuis Selesai'
                  : !settings.postTestOpen
                    ? 'Belum Dibuka Guru'
                    : 'Mulai Post-Test'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPilihanKuisScreen;
