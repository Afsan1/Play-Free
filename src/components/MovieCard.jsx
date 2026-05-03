import Link from 'next/link';
import styles from './MovieCard.module.css';

export default function MovieCard({ item }) {
  const title = item.title || item.name;
  const rating = item.vote_average?.toFixed(1);
  const year = (item.release_date || item.first_air_date)?.split('-')[0];
  const poster = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');

  return (
    <Link href={`/watch/${type}/${item.id}`} className={styles.card}>
      <img src={poster} alt={title} className={styles.poster} loading="lazy" />
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span>{year}</span>
          <div className={styles.rating}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            </svg>
            {rating}
          </div>
          <span style={{ textTransform: 'uppercase' }}>{type}</span>
        </div>
      </div>
    </Link>
  );
}
