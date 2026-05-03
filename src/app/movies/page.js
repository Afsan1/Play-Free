import { getTrending, getMoviesByGenre } from '@/lib/tmdb';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';

export default async function MoviesPage() {
  const trending = await getTrending('movie');
  const action = await getMoviesByGenre(28);
  const comedy = await getMoviesByGenre(35);
  const horror = await getMoviesByGenre(27);

  return (
    <main>
      <Navbar />
      <Hero content={trending.results[0]} />
      <div style={{ marginTop: '-100px', position: 'relative', zIndex: 20 }}>
        <MovieRow title="Trending Movies" items={trending.results} />
        <MovieRow title="Action" items={action.results} />
        <MovieRow title="Comedy" items={comedy.results} />
        <MovieRow title="Horror" items={horror.results} />
      </div>
    </main>
  );
}
