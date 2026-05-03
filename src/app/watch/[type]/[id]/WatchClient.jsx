'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Player from '@/components/Player';
import EpisodeSelector from '@/components/EpisodeSelector';
import MovieRow from '@/components/MovieRow';
import styles from './Watch.module.css';

export default function WatchClient({ type, id, details, initialEpisodes }) {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const title = details.title || details.name;
  const rating = details.vote_average?.toFixed(1);
  const overview = details.overview;
  const year = (details.release_date || details.first_air_date)?.split('-')[0];
  const poster = `https://image.tmdb.org/t/p/w500${details.poster_path}`;
  const recommendations = details.recommendations?.results || [];

  const handleEpisodeSelect = (s, e) => {
    setSeason(s);
    setEpisode(e);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main>
      <Navbar />
      
      <div className={styles.watchContainer}>
        <div className={styles.mainContent}>
          <Player type={type} id={id} season={season} episode={episode} />
          
          <div className={styles.details}>
            <div className={styles.infoWrapper}>
              <div className={styles.posterSide}>
                <img src={poster} alt={title} className={styles.mainPoster} />
              </div>
              <div className={styles.textSide}>
                <div className={styles.header}>
                  <h1 className={styles.title}>{title} {type === 'tv' && `- S${season} E${episode}`}</h1>
                  <div className={styles.meta}>
                    <span className={styles.rating}>★ {rating}</span>
                    <span>{year}</span>
                    <span className={styles.type}>{type}</span>
                  </div>
                </div>
                
                <p className={styles.overview}>{overview}</p>

                {type === 'tv' && (
                  <EpisodeSelector 
                    tvId={id} 
                    seasons={details.seasons || []} 
                    onSelect={handleEpisodeSelect}
                    initialEpisodes={initialEpisodes}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <MovieRow title="More Like This" items={recommendations} />
        </div>
      </div>
    </main>
  );
}
