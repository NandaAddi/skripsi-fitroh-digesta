import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import bgImg from '../../assets/menu-materi-screen/bg-menu-materi.webp';
import btnProses from '../../assets/menu-materi-screen/buton-proses-pencernaan.webp';
import btnOrgan from '../../assets/menu-materi-screen/button-organ-pencernaan.webp';
import btnGangguan from '../../assets/menu-materi-screen/button-gangguan-pencernaan.webp';
import { useAuth } from '../../context/AuthContext';
import './MenuMateriScreen.css';

type MateriTopicKey = 'proses' | 'organ' | 'gangguan';

interface TopicDetail {
  key: MateriTopicKey;
  title: string;
  subtitle: string;
  icon: string;
  sections: {
    heading: string;
    description: string;
    points: { label: string; text: string }[];
  }[];
}

const TOPIC_DETAILS: Record<MateriTopicKey, TopicDetail> = {
  proses: {
    key: 'proses',
    title: 'Proses Pencernaan',
    subtitle: 'Tahapan Mekanik dan Kimiawi Pemrosesan Makanan',
    icon: '🥣',
    sections: [
      {
        heading: '4 Tahapan Utama Pencernaan',
        description:
          'Sistem pencernaan memproses makanan melalui 4 fase berurutan untuk menyerap sari nutrisi:',
        points: [
          {
            label: '1. Ingesti',
            text: 'Proses memasukkan makanan ke dalam mulut, dikunyah oleh gigi, dan dicampur air liur.',
          },
          {
            label: '2. Digesti',
            text: 'Pemecahan molekul kompleks menjadi sederhana melalui mekanisme mekanik (gerak lambung) dan kimiawi (enzim).',
          },
          {
            label: '3. Absorpsi',
            text: 'Penyerapan sari-sari makanan oleh mikrovili usus halus ke dalam peredaran darah.',
          },
          {
            label: '4. Defekasi',
            text: 'Pengeluaran sisa-sisa makanan yang tidak dapat dicerna melalui usus besar dan anus.',
          },
        ],
      },
      {
        heading: 'Pencernaan Mekanik vs Kimiawi',
        description: 'Perbedaan dua metode kerja dalam sistem gastrointestinal:',
        points: [
          {
            label: 'Mekanik',
            text: 'Perubahan bentuk fisik makanan (mengunyah dengan gigi, mengaduk dengan otot dinding lambung, gerak peristaltik).',
          },
          {
            label: 'Kimiawi',
            text: 'Penguraian ikatan molekul menggunakan enzim (amilase/ptialin, pepsin, renin, lipase, dan tripsin).',
          },
        ],
      },
    ],
  },
  organ: {
    key: 'organ',
    title: 'Organ Pencernaan',
    subtitle: 'Anatomi Saluran Cerna dan Kelenjar Aksesori',
    icon: '🫁',
    sections: [
      {
        heading: 'Saluran Pencernaan Utama',
        description: 'Jalur berkesinambungan yang dilalui oleh makanan dari awal hingga akhir:',
        points: [
          {
            label: 'Mulut & Faring',
            text: 'Tempat masuknya makanan, pemecahan mekanik oleh gigi, dan kimiawi oleh enzim ptialin.',
          },
          {
            label: 'Esofagus (Kerongkongan)',
            text: 'Saluran berotot yang mendorong bolus ke lambung dengan gerak peristaltik.',
          },
          {
            label: 'Lambung',
            text: 'Kantung berotot tebal tempat makanan dicampur asam lambung (HCl) dan enzim pepsin menjadi kimus.',
          },
          {
            label: 'Usus Halus (Intestinum)',
            text: 'Terdiri dari duodenum, jejunum, dan ileum sebagai pusat penyerapan 90% nutrisi makanan.',
          },
          {
            label: 'Usus Besar & Anus',
            text: 'Menyerap kembali air dan elektrolit serta memadatkan feses sebelum dikeluarkan.',
          },
        ],
      },
      {
        heading: 'Organ & Kelenjar Aksesori',
        description: 'Organ pendukung yang memproduksi zat biokimia penting untuk pencernaan:',
        points: [
          {
            label: 'Hati (Hepar)',
            text: 'Menghasilkan cairan empedu untuk mengemulsi lemak makanan.',
          },
          {
            label: 'Kantung Empedu',
            text: 'Menyimpan dan mengonsentrasikan cairan empedu sebelum dialirkan ke duodenum.',
          },
          {
            label: 'Pankreas',
            text: 'Memproduksi getah pankreas kaya enzim (amilase, lipase, tripsinogen) serta insulin.',
          },
        ],
      },
    ],
  },
  gangguan: {
    key: 'gangguan',
    title: 'Gangguan Pencernaan',
    subtitle: 'Penyakit Umum, Gejala Klinis, dan Upaya Pencegahan',
    icon: '🩺',
    sections: [
      {
        heading: 'Penyakit & Gangguan Saluran Cerna',
        description: 'Berbagai gangguan kesehatan yang sering terjadi pada sistem pencernaan:',
        points: [
          {
            label: 'Gastritis (Maag)',
            text: 'Peradangan pada lapisan dinding mukosa lambung, sering dipicu oleh stres, telat makan, atau bakteri H. pylori.',
          },
          {
            label: 'GERD',
            text: 'Refluks asam lambung naik kembali ke esofagus menyebabkan sensasi terbakar di dada (heartburn).',
          },
          {
            label: 'Diare',
            text: 'Peningkatan frekuensi buang air besar cair akibat infeksi kuman atau keracunan yang mempercepat peristaltik.',
          },
          {
            label: 'Konstipasi (Sembelit)',
            text: 'Kesulitan buang air besar akibat feses keras yang disebabkan kurangnya asupan serat dan cairan.',
          },
          {
            label: 'Apendisitis (Usus Buntu)',
            text: 'Peradangan akut pada umbai cacing (apendiks) yang menimbulkan nyeri hebat di perut kanan bawah.',
          },
        ],
      },
      {
        heading: 'Tips Menjaga Kesehatan Saluran Cerna',
        description: 'Langkah preventif sederhana untuk menjaga kinerja optimal pencernaan:',
        points: [
          {
            label: 'Konsumsi Serat',
            text: 'Perbanyak sayur, buah, dan biji-bijian utuh untuk melancarkan gerak peristaltik usus.',
          },
          {
            label: 'Hidrasi Cukup',
            text: 'Minum minimal 8 gelas (2 liter) air putih bersih setiap hari.',
          },
          {
            label: 'Pola Makan Teratur',
            text: 'Kunyah makanan dengan perlahan (hingga lumat) dan hindari kebiasaan menunda waktu makan.',
          },
        ],
      },
    ],
  },
};

export const MenuMateriScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Ambil topik aktif dari parameter URL (misal: /menu/materi?topik=proses)
  const topicParam = searchParams.get('topik') as MateriTopicKey | null;
  const activeTopic = topicParam && TOPIC_DETAILS[topicParam] ? TOPIC_DETAILS[topicParam] : null;

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
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'chime') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(540, ctx.currentTime);
        osc1.frequency.setValueAtTime(820, ctx.currentTime + 0.08);
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
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      // AudioContext policy fallback
    }
  };

  const handleTopicClick = (key: MateriTopicKey) => {
    playSound('chime');
    if (key === 'gangguan') {
      navigate('/menu/materi/gangguan');
    } else {
      setSearchParams({ topik: key });
    }
  };

  const handleCloseModal = () => {
    playSound('soft');
    setSearchParams({});
  };

  const handleBackToMenu = () => {
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

  // Tutup modal jika tombol ESC ditekan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTopic) {
        setSearchParams({});
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTopic, setSearchParams]);

  return (
    <div className="menu-materi-viewport">
      {/* 16:9 Aspect Ratio Locked Stage */}
      <div className="menu-materi-stage" ref={stageRef}>
        {/* Layer 1: Background Dinding Bata Putih & Judul Lengkung SISTEM PENCERNAAN */}
        <img
          src={bgImg}
          alt="Latar Belakang Sistem Pencernaan DIGESTA"
          className="menu-materi-bg"
          draggable={false}
        />

        {/* Layer 2: Top Bar Navigasi (Kembali & Kontrol Audio/Fullscreen) */}
        <div className="menu-materi-topbar">
          <button
            type="button"
            className="menu-materi-btn-back"
            onClick={handleBackToMenu}
            title="Kembali ke Menu Utama"
            aria-label="Kembali ke Menu Utama"
          >
            <span>←</span>
            <span>Menu Utama</span>
          </button>

          <div className="menu-materi-controls-right">
            <button
              type="button"
              className="menu-materi-icon-btn"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playSound('pop');
              }}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            <button
              type="button"
              className="menu-materi-icon-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Fullscreen' : 'Mode Layar Penuh'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? '✕' : '⛶'}
            </button>

            {user && (
              <span className="menu-materi-user-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {user.fullName} {user.attendanceNumber ? `(#${user.attendanceNumber})` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Layer 3: Grid 3 Tombol Materi (Proses, Organ, Gangguan) */}
        <div className="menu-materi-cards-row">
          {/* Tombol 1: Proses Pencernaan */}
          <button
            type="button"
            className="menu-materi-card-btn"
            onClick={() => handleTopicClick('proses')}
            onMouseEnter={() => playSound('soft')}
            title="Buka Materi: Proses Pencernaan"
            aria-label="Proses Pencernaan"
          >
            <img
              src={btnProses}
              alt="Proses Pencernaan"
              className="menu-materi-card-img"
              draggable={false}
            />
          </button>

          {/* Tombol 2: Organ Pencernaan */}
          <button
            type="button"
            className="menu-materi-card-btn"
            onClick={() => handleTopicClick('organ')}
            onMouseEnter={() => playSound('soft')}
            title="Buka Materi: Organ Pencernaan"
            aria-label="Organ Pencernaan"
          >
            <img
              src={btnOrgan}
              alt="Organ Pencernaan"
              className="menu-materi-card-img"
              draggable={false}
            />
          </button>

          {/* Tombol 3: Gangguan Pencernaan */}
          <button
            type="button"
            className="menu-materi-card-btn"
            onClick={() => handleTopicClick('gangguan')}
            onMouseEnter={() => playSound('soft')}
            title="Buka Materi: Gangguan Pencernaan"
            aria-label="Gangguan Pencernaan"
          >
            <img
              src={btnGangguan}
              alt="Gangguan Pencernaan"
              className="menu-materi-card-img"
              draggable={false}
            />
          </button>
        </div>

        {/* Modal Interaktif Rincian Topik Materi */}
        {activeTopic && (
          <div className="menu-materi-modal-overlay" onClick={handleCloseModal}>
            <div className="menu-materi-modal-card" onClick={(e) => e.stopPropagation()}>
              {/* Header Modal */}
              <div className="menu-materi-modal-header">
                <div className="menu-materi-modal-header-left">
                  <div className="menu-materi-modal-icon">
                    {activeTopic.icon}
                  </div>
                  <div>
                    <h2 className="menu-materi-modal-title">{activeTopic.title}</h2>
                    <p className="menu-materi-modal-subtitle">{activeTopic.subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="menu-materi-modal-close-x"
                  onClick={handleCloseModal}
                  title="Tutup Modal"
                  aria-label="Tutup Modal"
                >
                  ✕
                </button>
              </div>

              {/* Isi Rincian Materi */}
              <div className="menu-materi-modal-body">
                {activeTopic.sections.map((section, sIdx) => (
                  <div key={sIdx} className="menu-materi-section-box">
                    <h3 className="menu-materi-section-title">
                      <span>📌</span>
                      <span>{section.heading}</span>
                    </h3>
                    <p className="menu-materi-section-desc">{section.description}</p>

                    <ul className="menu-materi-list">
                      {section.points.map((pt, pIdx) => (
                        <li key={pIdx} className="menu-materi-list-item">
                          <strong>{pt.label}:</strong> {pt.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer Modal */}
              <div className="menu-materi-modal-footer">
                <button
                  type="button"
                  className="menu-materi-footer-btn-secondary"
                  onClick={handleCloseModal}
                >
                  Tutup Penjelasan
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeTopic.key !== 'proses' && (
                    <button
                      type="button"
                      className="menu-materi-footer-btn-primary"
                      onClick={() => handleTopicClick('proses')}
                    >
                      Lihat Proses
                    </button>
                  )}
                  {activeTopic.key !== 'organ' && (
                    <button
                      type="button"
                      className="menu-materi-footer-btn-primary"
                      onClick={() => handleTopicClick('organ')}
                    >
                      Lihat Organ
                    </button>
                  )}
                  {activeTopic.key !== 'gangguan' && (
                    <button
                      type="button"
                      className="menu-materi-footer-btn-primary"
                      onClick={() => handleTopicClick('gangguan')}
                    >
                      Lihat Gangguan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuMateriScreen;
