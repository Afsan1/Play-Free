import { getTrending, getTVByGenre } from '@/lib/tmdb';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';

export default async function SeriesPage() {
  const trending = await getTrending('tv');
  const drama = await getTVByGenre(18);
  const sciFi = await getTVByGenre(10765);
  const crime = await getTVByGenre(80);

  return (
    <main>
      <Navbar />
      <Hero content={trending.results[0]} />
      <div style={{ marginTop: '-100px', position: 'relative', zIndex: 20 }}>
        <MovieRow title="Trending Series" items={trending.results} />
        <MovieRow title="Drama" items={drama.results} />
        <MovieRow title="Sci-Fi & Fantasy" items={sciFi.results} />
        <MovieRow title="Crime" items={crime.results} />
      </div>
    </main>
  );
}
