import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundScreen.css';

export const NotFoundScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-viewport">
      <div className="notfound-stage">
        <h1 className="notfound-code">404</h1>
        <div className="notfound-illustration">🔍🍎</div>
        <h2 className="notfound-title">Alur Pencernaan Terputus!</h2>
        <p className="notfound-desc">
          Ups! Rute halaman yang kamu tuju sepertinya tersesat atau belum ada di sistem DIGESTA.
          Yuk kembali ke jalur pembelajaran utama!
        </p>

        <div className="notfound-actions">
          <button
            type="button"
            className="notfound-btn-primary"
            onClick={() => navigate('/menu')}
          >
            📋 Buka Menu Utama
          </button>

          <button
            type="button"
            className="notfound-btn-secondary"
            onClick={() => navigate('/')}
          >
            🏠 Ke Layar Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundScreen;
