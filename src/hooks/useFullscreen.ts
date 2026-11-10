import { useState, useEffect, useCallback } from 'react';

/**
 * Hook global pengatur mode Fullscreen DIGESTA.
 * Memastikan requestFullscreen menargetkan document.documentElement (bukan container stage lokal),
 * sehingga sesi layar penuh tetap aktif dan tidak keluar saat pengguna berpindah rute (Menu -> Materi -> 3D -> dst).
 * Juga mendengarkan event native 'fullscreenchange' secara reaktif di seluruh browser (desktop, tablet, mobile).
 */
export function useFullscreen() {
  const getIsFullscreen = (): boolean => {
    if (typeof document === 'undefined') return false;
    const doc = document as unknown as {
      fullscreenElement?: Element | null;
      webkitFullscreenElement?: Element | null;
      mozFullScreenElement?: Element | null;
      msFullscreenElement?: Element | null;
    };
    return Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  };

  const [isFullscreen, setIsFullscreen] = useState<boolean>(getIsFullscreen);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(getIsFullscreen());
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = useCallback(async (): Promise<void> => {
    if (typeof document === 'undefined') return;
    try {
      const docEl = document.documentElement as unknown as {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
    } catch (err) {
      console.warn('[DIGESTA Fullscreen] Gagal masuk mode layar penuh:', err);
    }
  }, []);

  const exitFullscreen = useCallback(async (): Promise<void> => {
    if (typeof document === 'undefined') return;
    try {
      const doc = document as unknown as {
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        mozCancelFullScreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
      };

      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (err) {
      console.warn('[DIGESTA Fullscreen] Gagal keluar mode layar penuh:', err);
    }
  }, []);

  const toggleFullscreen = useCallback(async (): Promise<void> => {
    if (getIsFullscreen()) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}

export default useFullscreen;
