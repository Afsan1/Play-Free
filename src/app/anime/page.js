import { getAnime } from '@/lib/tmdb';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';

export default async function AnimePage() {
  const anime = await getAnime();
  
  return (
    <main>
      <Navbar />
      <Hero content={anime.results[0]} />
      <div style={{ marginTop: '-100px', position: 'relative', zIndex: 20 }}>
        <MovieRow title="Top Anime" items={anime.results} />
        <MovieRow title="Action Anime" items={anime.results.slice(5)} />
      </div>
    </main>
  );
}
