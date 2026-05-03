import MovieCard from './MovieCard';
import styles from './MovieRow.module.css';

export default function MovieRow({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.row}>
      <h2 className="section-title">{title}</h2>
      <div className={styles.container}>
        {items.map((item) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
