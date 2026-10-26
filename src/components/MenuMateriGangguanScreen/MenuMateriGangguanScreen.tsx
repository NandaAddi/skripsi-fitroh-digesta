import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../../assets/menu-materi-gangguan-pencernaan-screen/bg-menu-materi-gangguan-pencernaan-screen.webp';
import btnHome from '../../assets/menu-materi-gangguan-pencernaan-screen/button-home.webp';
import btnSetting from '../../assets/menu-materi-gangguan-pencernaan-screen/button-setting.webp';
import btnRight from '../../assets/menu-materi-gangguan-pencernaan-screen/button-right.webp';
import gastritisImg from '../../assets/menu-materi-gangguan-pencernaan-screen/gastritis.webp';
import { useAuth } from '../../context/AuthContext';
import './MenuMateriGangguanScreen.css';

export type GangguanKey = 'maag' | 'gastritis' | 'diare' | 'sembelit' | 'apendisitis';

interface GangguanDetail {
  id: GangguanKey;
  tabLabel: string;
  title: string;
  subtitle: string;
  organ: string;
  description: string;
  causes: string[];
  symptoms: string[];
  prevention: string[];
  youtubeVideoId?: string;
  imageSrc?: string;
}

const GANGGUAN_DATA: Record<GangguanKey, GangguanDetail> = {
  maag: {
    id: 'maag',
    tabLabel: 'MAAG',
    title: 'Penyakit Maag (Dispepsia)',
    subtitle: 'Rasa tidak nyaman atau perih pada perut bagian atas akibat asam lambung.',
    organ: 'Lambung',
    youtubeVideoId: 'rHnvtmmLh44',
    description:
      'Maag adalah kumpulan gejala rasa tidak nyaman, panas, atau perih pada perut bagian atas (ulu hati) yang biasanya dipicu oleh asam lambung yang mengikis lapisan dinding lambung.',
    causes: [
      'Pola makan tidak teratur atau sering menunda jam makan.',
      'Konsumsi makanan terlalu pedas, asam, atau berlemak tinggi.',
      'Tingkat stres berlebih dan konsumsi kafein berlebihan.',
    ],
    symptoms: [
      'Nyeri perih dan kembung pada area ulu hati.',
      'Cepat merasa kenyang saat makan dan sering bersendawa.',
      'Rasa mual dan kadang muntah setelah makan.',
    ],
    prevention: [
      'Makan tepat waktu dalam porsi kecil namun sering.',
      'Hindari makanan pemicu asam dan minuman berkafein/bersoda.',
      'Kelola stres dan hindari langsung tidur setelah makan.',
    ],
  },
  gastritis: {
    id: 'gastritis',
    tabLabel: 'GASTRITIS',
    title: 'Gastritis (Radang Lambung)',
    subtitle: 'Peradangan dan iritasi pada selaput mukosa pelindung dinding lambung.',
    organ: 'Lapisan Dinding Lambung',
    imageSrc: gastritisImg,
    description:
      'Gastritis terjadi saat lapisan pelindung dinding lambung mengalami peradangan. Jika tidak ditangani, gastritis dapat berkembang menjadi luka terbuka (tukak lambung) yang lebih serius.',
    causes: [
      'Infeksi bakteri Helicobacter pylori pada dinding mukosa.',
      'Penggunaan obat pereda nyeri (NSAID) dalam jangka panjang tanpa resep.',
      'Kebiasaan konsumsi alkohol dan asam berlebihan.',
    ],
    symptoms: [
      'Rasa panas membakar dan nyeri tajam di perut bagian atas.',
      'Hilang nafsu makan disertai rasa kembung dan begah.',
      'Feses berwarna gelap jika terjadi perdarahan lambung.',
    ],
    prevention: [
      'Mencuci tangan sebelum makan agar terhindar dari infeksi bakteri.',
      'Konsumsi makanan yang matang dan higienis.',
      'Gunakan obat pereda nyeri sesuai anjuran dokter.',
    ],
  },
  diare: {
    id: 'diare',
    tabLabel: 'DIARE',
    title: 'Diare (Mencret)',
    subtitle: 'Kondisi buang air besar encer dan sering akibat gangguan penyerapan usus.',
    organ: 'Usus Halus & Usus Besar',
    youtubeVideoId: 'cE3hijxgGm4',
    description:
      'Diare adalah kondisi ketika buang air besar terjadi lebih dari 3 kali sehari dengan konsistensi feses cair. Hal ini terjadi karena dinding usus mengalami iritasi sehingga tidak sempat menyerap cairan makanan.',
    causes: [
      'Infeksi kuman (bakteri E. coli, virus rotavirus) dari makanan kotor.',
      'Alergi makanan atau intoleransi laktosa (gula susu).',
      'Keracunan makanan yang terkontaminasi atau basi.',
    ],
    symptoms: [
      'Feses cair dan frekuensi buang air besar meningkat drastis.',
      'Kram perut, mulas melilit, dan dehidrasi (lemas & haus).',
      'Demam ringan dan rasa mual.',
    ],
    prevention: [
      'Selalu mencuci tangan dengan sabun setelah dari toilet dan sebelum makan.',
      'Meminum air bersih yang telah dimasak matang.',
      'Segera minum oralit saat diare untuk mengganti cairan tubuh yang hilang.',
    ],
  },
  sembelit: {
    id: 'sembelit',
    tabLabel: 'SEMBELIT',
    title: 'Sembelit (Konstipasi)',
    subtitle: 'Kondisi buang air besar keras dan tidak teratur akibat kekurangan serat.',
    organ: 'Usus Besar & Rektum',
    youtubeVideoId: 'WhTlp45g5hU',
    description:
      'Sembelit adalah kesulitan buang air besar karena feses menjadi kering, keras, dan padat. Hal ini terjadi saat usus besar menyerap air terlalu banyak akibat sisa makanan bergerak terlalu lambat.',
    causes: [
      'Kurang makan makanan berserat (sayur, buah, dan biji-bijian).',
      'Kurang minum air putih dan jarang melakukan aktivitas fisik.',
      'Sering menahan atau menunda keinginan buang air besar.',
    ],
    symptoms: [
      'Buang air besar kurang dari 3 kali dalam seminggu.',
      'Feses keras, kering, dan terasa sakit saat dikeluarkan.',
      'Perut terasa begah, padat, dan tidak tuntas.',
    ],
    prevention: [
      'Makan buah-buahan seperti pepaya, pisang, dan sayuran hijau setiap hari.',
      'Minum minimal 8 gelas air putih sehari.',
      'Rutin berolahraga dan jangan pernah menahan buang air besar.',
    ],
  },
  apendisitis: {
    id: 'apendisitis',
    tabLabel: 'APENDIKSITIS /\nUSUS BUNTU',
    title: 'Apendisitis (Radang Usus Buntu)',
    subtitle: 'Peradangan akut pada umbai cacing (apendiks) yang membutuhkan penanganan medis.',
    organ: 'Umbai Cacing (Apendiks)',
    youtubeVideoId: 'Av2xUNHjOCQ',
    description:
      'Apendisitis adalah peradangan parah pada usus buntu (umbai cacing), yaitu kantung kecil seukuran jari yang menempel di pangkal usus besar sebelah kanan bawah perut.',
    causes: [
      'Penyumbatan rongga usus buntu oleh feses yang mengeras (fekalit).',
      'Pembengkakan kelenjar getah bening di saluran pencernaan akibat infeksi.',
      'Penyumbatan oleh benda asing atau parasit usus.',
    ],
    symptoms: [
      'Nyeri mendadak yang dimulai di sekitar pusar lalu berpindah ke perut kanan bawah.',
      'Nyeri makin tajam saat batuk, berjalan, atau perut ditekan lalu dilepas.',
      'Demam tinggi, mual, muntah, dan hilang nafsu makan.',
    ],
    prevention: [
      'Perbanyak makanan berserat untuk mencegah feses mengeras.',
      'Jangan tunda buang air besar agar sisa makanan tidak menyumbat.',
      'Segera periksa ke dokter/UGD jika merasakan nyeri tajam di perut kanan bawah.',
    ],
  },
};

const TAB_ORDER: GangguanKey[] = ['maag', 'gastritis', 'diare', 'sembelit', 'apendisitis'];

export const MenuMateriGangguanScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<GangguanKey>('maag');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Synthesize cheerful cartoon pop sounds using Web Audio API
  const playSound = (type: 'pop' | 'chime' | 'soft' = 'pop') => {
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
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'chime') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.2);
        gain1.gain.setValueAtTime(0.25, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.25);
      } else {
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

  const handleTabChange = (key: GangguanKey) => {
    playSound('pop');
    setActiveTab(key);
  };

  const handleNextTab = () => {
    playSound('chime');
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % TAB_ORDER.length;
    setActiveTab(TAB_ORDER[nextIndex]);
  };

  const handleHomeClick = () => {
    playSound('pop');
    navigate('/menu/materi');
  };

  const toggleFullscreen = () => {
    playSound('soft');
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentData = GANGGUAN_DATA[activeTab];

  return (
    <div className="gangguan-viewport">
      {/* 16:9 Aspect Ratio Locked Stage */}
      <div className="gangguan-stage" ref={stageRef}>
        {/* Layer 1: Background Ruang Kelas */}
        <img
          src={bgImg}
          alt="Latar Ruang Kelas Materi Gangguan"
          className="gangguan-bg"
          draggable={false}
        />

        {/* Top-Left: Settings Round Button */}
        <button
          type="button"
          className="gangguan-ctrl-btn gangguan-btn-setting"
          onClick={() => {
            playSound('pop');
            setShowSettingsModal(true);
          }}
          title="Buka Pengaturan"
          aria-label="Pengaturan"
        >
          <img src={btnSetting} alt="Pengaturan" className="gangguan-ctrl-img" draggable={false} />
        </button>

        {/* Top-Right: Home Round Button */}
        <button
          type="button"
          className="gangguan-ctrl-btn gangguan-btn-home"
          onClick={handleHomeClick}
          title="Kembali ke Menu Materi"
          aria-label="Home"
        >
          <img src={btnHome} alt="Home" className="gangguan-ctrl-img" draggable={false} />
        </button>

        {/* Layer 2: Whiteboard with Left Overlapping Pill Tabs */}
        <div className="gangguan-board-container">
          {/* 5 Left Overlapping Capsule / Pill Buttons */}
          <div className="gangguan-pill-tabs">
            {TAB_ORDER.map((key) => {
              const item = GANGGUAN_DATA[key];
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`gangguan-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabChange(key)}
                  onMouseEnter={() => playSound('soft')}
                  aria-pressed={isActive}
                  title={`Lihat materi: ${item.title}`}
                >
                  <span className="gangguan-pill-label">{item.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Whiteboard Main Panel */}
          <div
            className={`gangguan-board-panel ${
              currentData.youtubeVideoId ? 'has-video' : currentData.imageSrc ? 'has-image' : ''
            }`}
          >
            {currentData.youtubeVideoId ? (
              <div className="gangguan-video-wrapper">
                <iframe
                  key={currentData.id}
                  className="gangguan-video-iframe"
                  src={`https://www.youtube.com/embed/${currentData.youtubeVideoId}?rel=0&modestbranding=1`}
                  title={currentData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : currentData.imageSrc ? (
              <div className="gangguan-image-wrapper">
                <img
                  src={currentData.imageSrc}
                  alt={currentData.title}
                  className="gangguan-image-media"
                  draggable={false}
                />
              </div>
            ) : (
              <>
                {/* Header Content */}
                <div className="gangguan-content-header">
                  <div className="gangguan-header-meta">
                    <span className="gangguan-organ-badge">Organ: {currentData.organ}</span>
                    <h1 className="gangguan-content-title">{currentData.title}</h1>
                  </div>
                  <p className="gangguan-content-subtitle">{currentData.subtitle}</p>
                </div>

                {/* Description Box */}
                <div className="gangguan-desc-box">
                  <p className="gangguan-desc-text">{currentData.description}</p>
                </div>

                {/* 3 Game Info Columns: Penyebab, Gejala, Pencegahan */}
                <div className="gangguan-cards-grid">
                  {/* Card 1: Penyebab */}
                  <div className="gangguan-card-box card-cause">
                    <div className="gangguan-card-header">
                      <span className="gangguan-card-icon">⚡</span>
                      <h3 className="gangguan-card-title">Penyebab Umum</h3>
                    </div>
                    <ul className="gangguan-points-list">
                      {currentData.causes.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Card 2: Gejala */}
                  <div className="gangguan-card-box card-symptom">
                    <div className="gangguan-card-header">
                      <span className="gangguan-card-icon">🩺</span>
                      <h3 className="gangguan-card-title">Gejala Klinis</h3>
                    </div>
                    <ul className="gangguan-points-list">
                      {currentData.symptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Card 3: Pencegahan */}
                  <div className="gangguan-card-box card-prevention">
                    <div className="gangguan-card-header">
                      <span className="gangguan-card-icon">🛡️</span>
                      <h3 className="gangguan-card-title">Pencegahan & Tips</h3>
                    </div>
                    <ul className="gangguan-points-list">
                      {currentData.prevention.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom-Right: Right Arrow Navigation Button */}
        <button
          type="button"
          className="gangguan-ctrl-btn gangguan-btn-right"
          onClick={handleNextTab}
          title="Lanjut ke Gangguan Berikutnya"
          aria-label="Selanjutnya"
        >
          <img src={btnRight} alt="Lanjut" className="gangguan-ctrl-img" draggable={false} />
        </button>

        {/* Settings Modal (Game-Themed) */}
        {showSettingsModal && (
          <div className="menuscreen-modal-overlay" onClick={() => setShowSettingsModal(false)}>
            <div
              className="menuscreen-modal-card menuscreen-modal-settings"
              onClick={(e) => e.stopPropagation()}
            >
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
                {user && (
                  <div className="menuscreen-setting-row">
                    <div>
                      <div className="menuscreen-setting-label">Pengguna Aktif</div>
                      <div className="menuscreen-setting-sub">
                        {user.attendanceNumber
                          ? `No. Absen: ${user.attendanceNumber}`
                          : user.role === 'guest'
                            ? 'Siswa Tamu (Tanpa Absen)'
                            : user.email || 'Siswa DIGESTA'}
                      </div>
                    </div>
                    <span className="menuscreen-user-tag">
                      {user.fullName} ({user.role === 'guest' ? 'Tamu' : 'Siswa'})
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
                    setShowSettingsModal(false);
                  }}
                >
                  Simpan & Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuMateriGangguanScreen;
