import React, { useState, useEffect, useCallback } from 'react';
import './ClickSparkle.css';

interface Particle {
  id: string;
  dx: string;
  dy: string;
  rot: string;
  color: string;
  size: number;
  isStar: boolean;
}

interface Burst {
  id: string;
  x: number;
  y: number;
  particles: Particle[];
}

const PALETTE = [
  '#fbbf24', // Gold Amber
  '#38bdf8', // Electric Cyan
  '#f43f5e', // Cartoon Pink/Red
  '#4ade80', // Game Green
  '#a855f7', // Violet
  '#f97316', // Orange
];

export const ClickSparkle: React.FC = () => {
  const [bursts, setBursts] = useState<Burst[]>([]);

  const handlePointerDown = useCallback((e: MouseEvent | PointerEvent) => {
    // Abaikan jika bukan klik kiri utama
    if ('button' in e && e.button !== 0) return;

    const burstId = 'burst_' + Math.random().toString(36).substring(2, 9);
    const particleCount = 6;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i * (360 / particleCount) + Math.random() * 30 - 15) * (Math.PI / 180);
      const distance = 24 + Math.random() * 26; // 24px - 50px
      const dx = `${Math.round(Math.cos(angle) * distance)}px`;
      const dy = `${Math.round(Math.sin(angle) * distance)}px`;
      const rot = `${Math.round((Math.random() - 0.5) * 180)}deg`;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const size = Math.floor(10 + Math.random() * 6); // 10px - 16px
      const isStar = i % 2 === 0;

      newParticles.push({
        id: `${burstId}_p_${i}`,
        dx,
        dy,
        rot,
        color,
        size,
        isStar,
      });
    }

    const newBurst: Burst = {
      id: burstId,
      x: e.clientX,
      y: e.clientY,
      particles: newParticles,
    };

    setBursts((prev) => [...prev.slice(-8), newBurst]); // Batasi maksimal 8 burst paralel

    // Hapus burst setelah animasi selesai (450ms)
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 450);
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [handlePointerDown]);

  if (bursts.length === 0) return null;

  return (
    <div className="click-sparkles-container" aria-hidden="true">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="click-burst"
          style={{ transform: `translate3d(${burst.x}px, ${burst.y}px, 0)` }}
        >
          <div className="click-ripple" />
          {burst.particles.map((p) => (
            <div
              key={p.id}
              className="click-particle"
              style={
                {
                  '--dx': p.dx,
                  '--dy': p.dy,
                  '--rot': p.rot,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  marginLeft: `${-p.size / 2}px`,
                  marginTop: `${-p.size / 2}px`,
                } as React.CSSProperties
              }
            >
              {p.isStar ? (
                <svg
                  width={p.size}
                  height={p.size}
                  viewBox="0 0 24 24"
                  fill={p.color}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                >
                  <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
                </svg>
              ) : (
                <svg
                  width={p.size}
                  height={p.size}
                  viewBox="0 0 20 20"
                  fill={p.color}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                >
                  <circle cx="10" cy="10" r="7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ClickSparkle;
