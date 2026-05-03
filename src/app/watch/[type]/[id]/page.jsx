import { getContentDetails, getSeasonDetails } from '@/lib/tmdb';
import WatchClient from './WatchClient';

export async function generateMetadata({ params }) {
  const { type, id } = await params;
  const details = await getContentDetails(type, id);
  return {
    title: `Watching ${details.title || details.name} | Free-Play`,
  };
}

export default async function WatchPage({ params }) {
  const { type, id } = await params;
  const details = await getContentDetails(type, id);
  
  let initialEpisodes = [];
  if (type === 'tv' && details.seasons?.length > 0) {
    // Fetch first season episodes on server for instant load
    const firstSeason = details.seasons[0].season_number;
    const seasonData = await getSeasonDetails(id, firstSeason);
    initialEpisodes = seasonData.episodes || [];
  }

  return (
    <WatchClient 
      type={type} 
      id={id} 
      details={details} 
      initialEpisodes={initialEpisodes} 
    />
  );
}
