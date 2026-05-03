'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Player.module.css';

export default function Player({ type, id, season, episode }) {
  const [source, setSource] = useState('embedsu');
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCssFullscreen, setIsCssFullscreen] = useState(false);
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const sources = {
    embedsu: type === 'movie'
      ? `https://embed.su/embed/movie/${id}`
      : `https://embed.su/embed/tv/${id}/${season}/${episode}`,
    '2embed': type === 'movie'
      ? `https://www.2embed.cc/embed/${id}`
      : `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
    autoembed: type === 'movie'
      ? `https://autoembed.co/movie/tmdb/${id}`
      : `https://autoembed.co/tv/tmdb/${id}-${season}-${episode}`,
  };

  // Timeout fallback so loader doesn't get stuck on mobile
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [id, season, episode, source]);

  // Inject iframe natively so no React attribute stripping
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = sources[source];
    iframe.style.cssText = 'width:100%;height:100%;border:0;display:block;';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('webkitallowfullscreen', '');
    iframe.setAttribute('mozallowfullscreen', '');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
    iframe.onload = () => setIsLoading(false);

    iframeRef.current = iframe;
    containerRef.current.appendChild(iframe);
  }, [source, id, season, episode, type]);

  // Track NATIVE fullscreen changes (desktop)
  useEffect(() => {
    const handleFsChange = () => {
      const nativeFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
      );
      setIsFullscreen(nativeFs);
      // If native fullscreen exited, also exit css fullscreen
      if (!nativeFs) setIsCssFullscreen(false);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
    };
  }, []);

  // Lock/unlock body scroll when CSS fullscreen is active
  useEffect(() => {
    if (isCssFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCssFullscreen]);

  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    const active = isFullscreen || isCssFullscreen;

    if (!active) {
      // Try native fullscreen first (works on Android Chrome + Desktop)
      const nativeFsWorks =
        iframe?.requestFullscreen ||
        iframe?.webkitRequestFullscreen ||
        iframe?.mozRequestFullScreen;

      if (nativeFsWorks && document.fullscreenEnabled) {
        try {
          if (iframe.requestFullscreen) iframe.requestFullscreen();
          else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
          else if (iframe.mozRequestFullScreen) iframe.mozRequestFullScreen();
          return;
        } catch (e) {
          // Fall through to CSS fullscreen below
        }
      }

      // CSS fullscreen fallback (iOS Safari, restricted browsers)
      setIsCssFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      }
      setIsCssFullscreen(false);
      setIsFullscreen(false);
    }
  };

  const active = isFullscreen || isCssFullscreen;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Hide server buttons when in CSS fullscreen */}
      {!isCssFullscreen && (
        <div className={styles.sourceSelector}>
          {Object.keys(sources).map((src) => (
            <button
              key={src}
              onClick={() => setSource(src)}
              className={source === src ? styles.active : ''}
              suppressHydrationWarning
            >
              Server {src.split('_').join(' ').toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div className={`${styles.playerContainer} ${isCssFullscreen ? styles.cssFullscreen : ''}`}>
        {isLoading && (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Connecting to {source} server...</p>
          </div>
        )}

        {/* Native iframe mount point */}
        <div
          ref={containerRef}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        />

        {/* Custom fullscreen button */}
        <button
          className={styles.fullscreenBtn}
          onClick={handleFullscreen}
          title={active ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {active ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          )}
        </button>
      </div>

      {!isCssFullscreen && (
        <div className={styles.warning}>
          <p>Tip: If a server is slow, try switching servers above. Use an Ad-Blocker for the best experience.</p>
        </div>
      )}
    </div>
  );
}
