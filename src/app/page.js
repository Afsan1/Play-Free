import { getTrending, getMoviesByGenre, getTVByGenre, getAnime } from '@/lib/tmdb';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';

export default async function Home() {
  const trending = await getTrending();
  const trendingAll = trending.results;
  const heroContent = trendingAll[Math.floor(Math.random() * 5)]; // Randomly pick one of top 5

  const movies = await getTrending('movie');
  const series = await getTrending('tv');
  const anime = await getAnime();
  
  // Animation/Anime genres often 16
  const actionMovies = await getMoviesByGenre(28);

  return (
    <main>
      <Navbar />
      <Hero content={heroContent} />
      
      <div style={{ marginTop: '-100px', position: 'relative', zIndex: 20 }}>
        <MovieRow title="Trending Today" items={trendingAll} />
        <MovieRow title="Popular Movies" items={movies.results} />
        <MovieRow title="Popular Series" items={series.results} />
        <MovieRow title="Top Anime" items={anime.results} />
        <MovieRow title="Action Packed" items={actionMovies.results} />
      </div>

      <footer style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>© 2026 Free-Play. Built for entertainment.</p>
      </footer>
    </main>
  );
}
