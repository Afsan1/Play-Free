'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Player.module.css';

export default function Player({ type, id, season, episode }) {
  const [source, setSource] = useState('embedsu');
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  
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

  useEffect(() => {
    setIsLoading(true);
    
    // Fallback for mobile browsers where iframe onLoad might not fire
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [id, season, episode, source]);

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous iframe
      containerRef.current.innerHTML = '';
      
      // Create iframe natively to completely bypass React attribute stripping
      const iframe = document.createElement('iframe');
      iframe.src = sources[source];
      iframe.className = styles.iframe;
      iframe.setAttribute('frameBorder', '0');
      
      // Native Fullscreen and Media permissions
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('webkitallowfullscreen', 'true');
      iframe.setAttribute('mozallowfullscreen', 'true');
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
      iframe.setAttribute('referrerPolicy', 'origin');
      
      iframe.onload = () => setIsLoading(false);
      
      containerRef.current.appendChild(iframe);
    }
  }, [source, id, season, episode, type]);

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
        
        {/* Container for native iframe injection */}
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></div>
      </div>

      <div className={styles.warning}>
        <p>Tip: If a server is slow, try switching servers above. Use an Ad-Blocker for the best experience.</p>
      </div>
    </div>
  );
}
