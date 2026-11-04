import { useState, useEffect } from 'react';

export const BASE_GAME_WIDTH = 1920;
export const BASE_GAME_HEIGHT = 1080;

export interface GameScaleInfo {
  scale: number;
  isPortrait: boolean;
  windowWidth: number;
  windowHeight: number;
}

/**
 * Hook global pengatur skala kanvas panggung 1920x1080 DIGESTA.
 * Menghitung faktor skala seragam Math.min(viewportW / 1920, viewportH / 1080)
 * dan menginjeksi custom property `--game-scale` pada root document.
 * Juga mendeteksi apakah perangkat sedang dalam orientasi portrait.
 */
export function useGameScale(): GameScaleInfo {
  const [scaleInfo, setScaleInfo] = useState<GameScaleInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        scale: 1,
        isPortrait: false,
        windowWidth: BASE_GAME_WIDTH,
        windowHeight: BASE_GAME_HEIGHT,
      };
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const s = Math.min(w / BASE_GAME_WIDTH, h / BASE_GAME_HEIGHT);
    const isTouch =
      'ontouchstart' in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      w <= 820;
    const portrait = Boolean(isTouch && h > w);
    return {
      scale: s,
      isPortrait: portrait,
      windowWidth: w,
      windowHeight: h,
    };
  });

  useEffect(() => {
    let rafId: number | null = null;

    const updateScale = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const s = Math.min(w / BASE_GAME_WIDTH, h / BASE_GAME_HEIGHT);
        const isTouch =
          'ontouchstart' in window ||
          (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
          w <= 820;
        const portrait = Boolean(isTouch && h > w);

        // Update CSS Custom Property pada :root
        document.documentElement.style.setProperty('--game-scale', s.toFixed(5));

        setScaleInfo({
          scale: s,
          isPortrait: portrait,
          windowWidth: w,
          windowHeight: h,
        });
      });
    };

    // Update inisial saat mount
    updateScale();

    window.addEventListener('resize', updateScale, { passive: true });
    window.addEventListener('orientationchange', updateScale, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateScale);
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateScale);
      }
    };
  }, []);

  return scaleInfo;
}

