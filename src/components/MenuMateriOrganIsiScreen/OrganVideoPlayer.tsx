import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playSound } from '../../services/soundService';
import './OrganVideoPlayer.css';

interface OrganVideoPlayerProps {
  src: string;
  title: string;
  soundEnabled?: boolean;
}

export const OrganVideoPlayer: React.FC<OrganVideoPlayerProps> = ({
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
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Scrubber Progress Bar Seek
  const seekTo = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!progressBarRef.current || !videoRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    seekTo(e);

    const onMouseMove = (moveEvent: MouseEvent) => {
      seekTo(moveEvent);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Toggle Fullscreen Layar Penuh
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    playSound('pop', soundEnabled);

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Sinkronisasi status fullscreen dari browser event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    const videoEl = videoRef.current;

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearControlsTimer();
      if (videoEl) {
        videoEl.pause();
      }
    };
  }, []);

  // Update Waktu dan Durasi dari Native Video Element
  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  // Persentase progress bar
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`organ-custom-player ${isFullscreen ? 'fullscreen-active' : ''} ${!showControls && isPlaying ? 'hide-cursor' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label={`Pemutar Video Materi ${title}`}
    >
      {/* Video Element Terkunci 16:9 Murni Tanpa Bar Hitam */}
      <video
        ref={videoRef}
        src={src}
        className="organ-player-video-el"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        playsInline
        preload="metadata"
      />

      {/* Overlay Tombol Play Besar di Tengah Saat Video Pause */}
      {!isPlaying && (
        <div className="organ-center-play-overlay" onClick={togglePlay}>
          <button
            type="button"
            className="organ-center-play-btn"
            title="Mulai Video"
            aria-label="Mulai Video"
          >
            <svg viewBox="0 0 24 24" className="organ-center-play-icon" fill="currentColor">
              <polygon points="7 4 19 12 7 20 7 4" />
            </svg>
          </button>
        </div>
      )}

      {/* Lapisan Kontrol Player Bawah Bergaya Game Interaktif */}
      <div className={`organ-player-controls ${showControls || !isPlaying ? 'visible' : 'hidden'}`}>
        {/* Progress Bar Interaktif yang Bisa Digeser (Scrubbing) */}
        <div
          ref={progressBarRef}
          className="organ-progress-track"
          onMouseDown={handleProgressBarMouseDown}
          title="Geser durasi video"
          role="slider"
          aria-label="Progres Video"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="organ-progress-fill" style={{ width: `${progressPercent}%` }}>
            <div className="organ-progress-handle" />
          </div>
        </div>

        {/* Baris Tombol Aksi Kontrol */}
        <div className="organ-controls-row">
          {/* Sisi Kiri: Play/Pause, Restart, Timer */}
          <div className="organ-controls-group-left">
            {/* Tombol Play / Pause */}
            <button
              type="button"
              className="organ-ctrl-push-btn btn-play-pause"
              onClick={togglePlay}
              title={isPlaying ? 'Jeda (Spasi)' : 'Putar (Spasi)'}
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="organ-btn-icon" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1.5" />
                  <rect x="14" y="4" width="4" height="16" rx="1.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="organ-btn-icon" fill="currentColor">
                  <polygon points="7 4 19 12 7 20 7 4" />
                </svg>
              )}
            </button>

            {/* Tombol Putar Ulang Dari Awal */}
            <button
              type="button"
              className="organ-ctrl-push-btn btn-restart"
              onClick={handleRestart}
              title="Ulangi dari Awal"
              aria-label="Ulangi dari Awal"
            >
              <svg
                viewBox="0 0 24 24"
                className="organ-btn-icon"
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
            <div className="organ-time-badge">
              <span className="current-time">{formatTime(currentTime)}</span>
              <span className="time-divider">/</span>
              <span className="total-duration">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Sisi Kanan: Volume & Fullscreen */}
          <div className="organ-controls-group-right">
            {/* Kontrol Volume & Mute */}
            <div className="organ-volume-control-wrapper">
              <button
                type="button"
                className="organ-ctrl-push-btn btn-volume"
                onClick={toggleMute}
                title={isMuted ? 'Bunyikan Suara' : 'Bisukan Suara'}
                aria-label={isMuted ? 'Bunyikan' : 'Bisukan'}
              >
                {isMuted || volume === 0 ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="organ-btn-icon"
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
                    className="organ-btn-icon"
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
                className="organ-volume-slider"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                aria-label="Volume"
              />
            </div>

            {/* Tombol Fullscreen Layar Penuh */}
            <button
              type="button"
              className="organ-ctrl-push-btn btn-fullscreen"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Layar Penuh (F)' : 'Layar Penuh (F)'}
              aria-label={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            >
              {isFullscreen ? (
                <svg
                  viewBox="0 0 24 24"
                  className="organ-btn-icon"
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
                  className="organ-btn-icon"
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

export default OrganVideoPlayer;
