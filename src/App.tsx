import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import StartScreen from './components/StartScreen/StartScreen';
import LoginScreen from './components/LoginScreen/LoginScreen';
import MenuScreen from './components/MenuScreen/MenuScreen';
import MenuMateriScreen from './components/MenuMateriScreen/MenuMateriScreen';
import MenuMateriGangguanScreen from './components/MenuMateriGangguanScreen/MenuMateriGangguanScreen';
import MenuPengantarScreen from './components/MenuPengantarScreen/MenuPengantarScreen';
import NotFoundScreen from './components/NotFound/NotFoundScreen';

function App() {
  return (
    <AuthProvider>
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

            {/* Halaman Khusus Gangguan Pencernaan */}
            <Route
              path="/menu/materi/gangguan"
              element={
                <ProtectedRoute>
                  <MenuMateriGangguanScreen />
                </ProtectedRoute>
              }
            />

            {/* Alias kemudahan akses rute */}
            <Route path="/pengantar" element={<Navigate to="/menu/pengantar" replace />} />
            <Route path="/materi" element={<Navigate to="/menu/materi" replace />} />
            <Route path="/gangguan" element={<Navigate to="/menu/materi/gangguan" replace />} />
            <Route path="/materi/gangguan" element={<Navigate to="/menu/materi/gangguan" replace />} />

            {/* Rute 404 Not Found Catch-All */}
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
