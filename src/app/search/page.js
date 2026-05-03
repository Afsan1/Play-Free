import { searchContent } from '@/lib/tmdb';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import styles from './Search.module.css';

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q || '';
  const results = query ? await searchContent(query) : { results: [] };

  return (
    <main>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>
          {query ? `Search Results for "${query}"` : 'Search for Movies & TV Shows'}
        </h1>
        
        <div className={styles.grid}>
          {results.results?.filter(item => item.media_type !== 'person').map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>

        {query && (!results.results || results.results.length === 0) && (
          <p className={styles.noResults}>No results found for your search.</p>
        )}
      </div>
    </main>
  );
}
