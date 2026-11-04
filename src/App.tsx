import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import StartScreen from './components/StartScreen/StartScreen';
import LoginScreen from './components/LoginScreen/LoginScreen';
import MenuScreen from './components/MenuScreen/MenuScreen';
import MenuMateriScreen from './components/MenuMateriScreen/MenuMateriScreen';
import MenuMateriProsesScreen from './components/MenuMateriProsesScreen/MenuMateriProsesScreen';
import MenuMateriOrganScreen from './components/MenuMateriOrganScreen/MenuMateriOrganScreen';
import MenuMateriOrganIsiScreen from './components/MenuMateriOrganIsiScreen/MenuMateriOrganIsiScreen';
import MenuMateriGangguanScreen from './components/MenuMateriGangguanScreen/MenuMateriGangguanScreen';
import MenuPengantarScreen from './components/MenuPengantarScreen/MenuPengantarScreen';
import MenuPetunjukScreen from './components/MenuPetunjukScreen/MenuPetunjukScreen';
import Menu3DScreen from './components/Menu3DScreen/Menu3DScreen';
import MenuKuisScreen from './components/MenuKuisScreen/MenuKuisScreen';
import MenuLeaderboardScreen from './components/MenuLeaderboardScreen/MenuLeaderboardScreen';
import AdminDashboardScreen from './components/AdminDashboardScreen/AdminDashboardScreen';
import NotFoundScreen from './components/NotFound/NotFoundScreen';
import AssetPreloader from './components/AssetPreloader/AssetPreloader';
import ClickSparkle from './components/ClickSparkle/ClickSparkle';
import OrientationOverlay from './components/OrientationOverlay/OrientationOverlay';
import { useGameScale } from './hooks/useGameScale';

function App() {
  const [isPreloadDone, setIsPreloadDone] = useState(false);
  const { isPortrait } = useGameScale();

  return (
    <AuthProvider>
      <OrientationOverlay show={isPortrait} />
      <ClickSparkle />
      {!isPreloadDone && (
        <AssetPreloader onComplete={() => setIsPreloadDone(true)} />
      )}
      <BrowserRouter>
        <main style={{ width: '100%', height: '100%' }}>
          <Routes>
            {/* Rute Publik */}
            <Route path="/" element={<StartScreen />} />
            <Route path="/login" element={<LoginScreen />} />

            {/* Rute Terproteksi: Menu Utama */}
            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <MenuScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Menu Pengantar */}
            <Route
              path="/menu/pengantar"
              element={
                <ProtectedRoute>
                  <MenuPengantarScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Menu Materi Sistem Pencernaan */}
            <Route
              path="/menu/materi"
              element={
                <ProtectedRoute>
                  <MenuMateriScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Proses Pencernaan */}
            <Route
              path="/menu/materi/proses"
              element={
                <ProtectedRoute>
                  <MenuMateriProsesScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Organ Pencernaan: Menu Pemilihan Organ */}
            <Route
              path="/menu/materi/organ"
              element={
                <ProtectedRoute>
                  <MenuMateriOrganScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Isi Materi Organ Pencernaan (Ruang Kelas Bu Rini) */}
            <Route
              path="/menu/materi/organ/isi"
              element={
                <ProtectedRoute>
                  <MenuMateriOrganIsiScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu/materi/organ/isi/:organId"
              element={
                <ProtectedRoute>
                  <MenuMateriOrganIsiScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu/materi/organ/:organId"
              element={
                <ProtectedRoute>
                  <MenuMateriOrganIsiScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Gangguan Pencernaan */}
            <Route
              path="/menu/materi/gangguan"
              element={
                <ProtectedRoute>
                  <MenuMateriGangguanScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Menu 3D Organ Pencernaan (Sketchfab Embed) */}
            <Route
              path="/menu/3d"
              element={
                <ProtectedRoute>
                  <Menu3DScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu/3d/:organId"
              element={
                <ProtectedRoute>
                  <Menu3DScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Menu Kuis Interaktif */}
            <Route
              path="/menu/kuis"
              element={
                <ProtectedRoute>
                  <MenuKuisScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Menu Petunjuk Penggunaan */}
            <Route
              path="/menu/petunjuk"
              element={
                <ProtectedRoute>
                  <MenuPetunjukScreen />
                </ProtectedRoute>
              }
            />

            {/* Halaman Khusus Papan Peringkat (Leaderboard) */}
            <Route
              path="/menu/leaderboard"
              element={
                <ProtectedRoute>
                  <MenuLeaderboardScreen />
                </ProtectedRoute>
              }
            />

            {/* Alias kemudahan akses rute */}
            <Route path="/pengantar" element={<Navigate to="/menu/pengantar" replace />} />
            <Route path="/petunjuk" element={<Navigate to="/menu/petunjuk" replace />} />
            <Route path="/leaderboard" element={<Navigate to="/menu/leaderboard" replace />} />
            <Route path="/peringkat" element={<Navigate to="/menu/leaderboard" replace />} />
            <Route path="/materi" element={<Navigate to="/menu/materi" replace />} />
            <Route path="/proses" element={<Navigate to="/menu/materi/proses" replace />} />
            <Route path="/materi/proses" element={<Navigate to="/menu/materi/proses" replace />} />
            <Route path="/organ" element={<Navigate to="/menu/materi/organ" replace />} />
            <Route path="/materi/organ" element={<Navigate to="/menu/materi/organ" replace />} />
            <Route path="/organ/isi" element={<Navigate to="/menu/materi/organ/isi" replace />} />
            <Route path="/materi/organ/isi" element={<Navigate to="/menu/materi/organ/isi" replace />} />
            <Route path="/gangguan" element={<Navigate to="/menu/materi/gangguan" replace />} />
            <Route path="/materi/gangguan" element={<Navigate to="/menu/materi/gangguan" replace />} />
            <Route path="/3d" element={<Navigate to="/menu/3d" replace />} />
            <Route path="/3d/:organId" element={<Navigate to="/menu/3d" replace />} />
            <Route path="/kuis" element={<Navigate to="/menu/kuis" replace />} />

            {/* Rute Khusus Dashboard Guru / Admin */}
            <Route path="/admin" element={<AdminDashboardScreen />} />
            <Route path="/guru" element={<Navigate to="/admin" replace />} />

            {/* Rute 404 Not Found Catch-All */}
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
