import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playSound } from '../../services/soundService';

interface GangguanVideoPlayerProps {
  src: string;
  title: string;
  soundEnabled?: boolean;
}

export const GangguanVideoPlayer: React.FC<GangguanVideoPlayerProps> = ({
  src,
  title,
  soundEnabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Format detik ke format mm:ss
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Bersihkan timer auto-hide controls
  const clearControlsTimer = () => {
    if (controlsTimeoutRef.current !== null) {
      window.clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  };

  // Reset timer auto-hide saat mouse bergerak
  const handleMouseMove = () => {
    setShowControls(true);
    clearControlsTimer();

    if (isPlaying && !isDragging) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying && !isDragging) {
      setShowControls(false);
    }
  };

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    playSound('pop', soundEnabled);

    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [soundEnabled]);

  // Restart video dari awal (0:00)
  const handleRestart = () => {
    if (!videoRef.current) return;
    playSound('pop', soundEnabled);
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    videoRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    playSound('soft', soundEnabled);
    const newMuteState = !isMuted;
    videoRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  };

  // Ubah Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Toggle Fullscreen pada player container
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    playSound('soft', soundEnabled);

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Sinkronisasi status fullscreen dari document
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      clearControlsTimer();
    };
  }, []);

  // Update time saat video diputar
  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Update durasi saat metadata video dimuat
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  };

  // Handler klik / seek pada Progress Bar
  const handleSeek = useCallback(
    (clientX: number) => {
      if (!progressBarRef.current || !videoRef.current || duration <= 0) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetTime = pos * duration;
      setCurrentTime(targetTime);
      videoRef.current.currentTime = targetTime;
    },
    [duration]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e.clientX);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleSeek(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleSeek]);

  // Keyboard shortcut saat video aktif (Space = Play/Pause, M = Mute, F = Fullscreen)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (videoRef.current) {
        videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      }
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      toggleMute();
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`gangguan-custom-player ${isFullscreen ? 'fullscreen' : ''} ${!isPlaying ? 'paused' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Pemutar Video Materi ${title}`}
    >
      {/* Video Element Terkunci 16:9 Tanpa Bar Hitam */}
      <video
        ref={videoRef}
        src={src}
        className="gangguan-player-video-el"
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
        }}
      />

      {/* Tombol Play Besar di Tengah (Tactile Cartoon 3D) Saat Video Dijeda */}
      {!isPlaying && (
        <button
          type="button"
          className="gangguan-center-play-btn"
          onClick={togglePlay}
          title="Putar Video Materi"
          aria-label="Putar Video"
        >
          <div className="gangguan-center-play-circle">
            <svg viewBox="0 0 24 24" className="gangguan-center-play-icon" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
          <span className="gangguan-center-play-label">Putar Video</span>
        </button>
      )}

      {/* Overlay Kontrol Pemutar Video Game Kustom */}
      <div
        className={`gangguan-player-controls ${showControls || !isPlaying || isDragging ? 'visible' : 'hidden'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar Interaktif Game (Scrubber) */}
        <div
          ref={progressBarRef}
          className="gangguan-progress-track-wrapper"
          onMouseDown={handleMouseDown}
          title={`Waktu: ${formatTime(currentTime)} / ${formatTime(duration)}`}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-label="Posisi Waktu Video"
        >
          <div className="gangguan-progress-track">
            <div
              className="gangguan-progress-filled"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="gangguan-progress-thumb" />
            </div>
          </div>
        </div>

        {/* Bar Tombol Kontrol Bawah */}
        <div className="gangguan-controls-bottom-bar">
          {/* Sisi Kiri: Play/Pause, Restart, Waktu */}
          <div className="gangguan-controls-group-left">
            {/* Tombol Play / Pause */}
            <button
              type="button"
              className="gangguan-ctrl-push-btn btn-play-pause"
              onClick={togglePlay}
              title={isPlaying ? 'Jeda (Spasi)' : 'Putar (Spasi)'}
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="gangguan-btn-icon" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1.5" />
                  <rect x="14" y="4" width="4" height="16" rx="1.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="gangguan-btn-icon" fill="currentColor">
                  <polygon points="7 4 19 12 7 20 7 4" />
                </svg>
              )}
            </button>

            {/* Tombol Putar Ulang Dari Awal */}
            <button
              type="button"
              className="gangguan-ctrl-push-btn btn-restart"
              onClick={handleRestart}
              title="Ulangi dari Awal"
              aria-label="Ulangi dari Awal"
            >
              <svg
                viewBox="0 0 24 24"
                className="gangguan-btn-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>

            {/* Indikator Waktu (mm:ss / mm:ss) Tipografi Fredoka Game */}
            <div className="gangguan-time-badge">
              <span className="current-time">{formatTime(currentTime)}</span>
              <span className="time-divider">/</span>
              <span className="total-duration">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Sisi Kanan: Volume & Fullscreen */}
          <div className="gangguan-controls-group-right">
            {/* Kontrol Volume & Mute */}
            <div className="gangguan-volume-control-wrapper">
              <button
                type="button"
                className="gangguan-ctrl-push-btn btn-volume"
                onClick={toggleMute}
                title={isMuted ? 'Bunyikan Suara (M)' : 'Bisukan Suara (M)'}
                aria-label={isMuted ? 'Bunyikan' : 'Bisukan'}
              >
                {isMuted || volume === 0 ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="gangguan-btn-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="gangguan-btn-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>

              {/* Slider Pengatur Volume */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="gangguan-volume-slider"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                aria-label="Volume"
              />
            </div>

            {/* Tombol Fullscreen Layar Penuh */}
            <button
              type="button"
              className="gangguan-ctrl-push-btn btn-fullscreen"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Layar Penuh (F)' : 'Layar Penuh (F)'}
              aria-label={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            >
              {isFullscreen ? (
                <svg
                  viewBox="0 0 24 24"
                  className="gangguan-btn-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="gangguan-btn-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6" />
                  <path d="M9 21H3v-6" />
                  <path d="M21 3l-7 7" />
                  <path d="M3 21l7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
