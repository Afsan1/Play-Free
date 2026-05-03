'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Player.module.css';

export default function Player({ type, id, season, episode }) {
  const [source, setSource] = useState('embedsu');
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const sources = {
    embedsu: type === 'movie'
      ? `https://embed.su/embed/movie/${id}`
      : `https://embed.su/embed/tv/${id}/${season}/${episode}`,
    vidsrc_me: type === 'movie'
      ? `https://vidsrc.me/embed/movie?tmdb=${id}`
      : `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${season}&epi=${episode}`,
    vidsrc: type === 'movie'
      ? `https://vidsrc.to/embed/movie/${id}`
      : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
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

  // Track fullscreen changes to update button icon
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement)
      );
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

  // Our own fullscreen button — directly calls requestFullscreen on the iframe
  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (!isFullscreen) {
      if (iframe.requestFullscreen) iframe.requestFullscreen();
      else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
      else if (iframe.mozRequestFullScreen) iframe.mozRequestFullScreen();
      else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    }
  };

  return (
    <div className={styles.wrapper}>
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

      <div className={styles.playerContainer}>
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

        {/* Custom fullscreen button — always works regardless of iframe restrictions */}
        <button
          className={styles.fullscreenBtn}
          onClick={handleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            /* Exit icon */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
          ) : (
            /* Enter icon */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          )}
        </button>
      </div>

      <div className={styles.warning}>
        <p>Tip: If a server is slow, try switching servers above. Use an Ad-Blocker for the best experience.</p>
      </div>
    </div>
  );
}
