'use client';

import { useState, useEffect } from 'react';
import styles from './EpisodeSelector.module.css';

export default function EpisodeSelector({ tvId, seasons, onSelect, initialEpisodes = [] }) {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Skip fetch if we are looking at the initial season and have initial episodes
    if (selectedSeason === seasons[0]?.season_number && initialEpisodes.length > 0) {
      setEpisodes(initialEpisodes);
      return;
    }

    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/season/${selectedSeason}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const data = await res.json();
        setEpisodes(data.episodes || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    if (tvId) fetchEpisodes();
  }, [tvId, selectedSeason, initialEpisodes, seasons]);

  return (
    <div className={styles.container}>
      <div className={styles.seasonPicker}>
        <select 
          value={selectedSeason} 
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          suppressHydrationWarning
        >
          {seasons.map((s) => (
            <option key={s.id} value={s.season_number}>
              Season {s.season_number}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.episodeGrid}>
        {loading ? (
          <div className={styles.loader}>Loading episodes...</div>
        ) : (
          episodes.map((ep) => (
            <button 
              key={ep.id} 
              className={styles.episodeBtn}
              onClick={() => onSelect(selectedSeason, ep.episode_number)}
              suppressHydrationWarning
            >
              <div className={styles.epNum}>EP {ep.episode_number}</div>
              <div className={styles.epName}>{ep.name}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
