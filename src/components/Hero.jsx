import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero({ content }) {
  if (!content) return null;

  const title = content.title || content.name;
  const overview = content.overview;
  const backdrop = `https://image.tmdb.org/t/p/original${content.backdrop_path}`;
  const poster = `https://image.tmdb.org/t/p/w500${content.poster_path}`;
  const type = content.media_type || (content.first_air_date ? 'tv' : 'movie');

  return (
    <section className={styles.hero}>
      <div className={styles.backdrop}>
        <img src={backdrop} alt={title} />
      </div>
      <div className={styles.overlay}></div>
      
      <div className={`${styles.content} fade-in`}>
        <div className={styles.flexInfo}>
          <div className={styles.posterWrapper}>
            <img src={poster} alt={title} className={styles.smallPoster} />
          </div>
          <div className={styles.textDetails}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.overview}>{overview}</p>
            
            <div className={styles.buttons}>
              <Link href={`/watch/${type}/${content.id}`} className={`${styles.btn} ${styles.primary}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
