const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

export const fetchFromTMDB = async (endpoint, params = {}, retries = 2) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params,
    });

    const url = `${BASE_URL}${endpoint}?${queryParams}`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { results: [], genres: [] };
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (retries > 0) {
      console.log(`Retrying fetch for ${endpoint}... (${retries} left)`);
      // Wait 1s before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchFromTMDB(endpoint, params, retries - 1);
    }

    // Silently return fallback if all retries fail to avoid alarming the user with console errors
    return { results: [], genres: [] };
  }
};

export const getTrending = async (type = 'all', time = 'day') => {
  return fetchFromTMDB(`/trending/${type}/${time}`);
};

export const getMoviesByGenre = async (genreId) => {
  return fetchFromTMDB('/discover/movie', { with_genres: genreId });
};

export const getTVByGenre = async (genreId) => {
  return fetchFromTMDB('/discover/tv', { with_genres: genreId });
};

export const searchContent = async (query) => {
  return fetchFromTMDB('/search/multi', { query });
};

export const getContentDetails = async (type, id) => {
  const details = await fetchFromTMDB(`/${type}/${id}`, { append_to_response: 'videos,credits,recommendations' });
  if (details.results && details.results.length === 0 && !details.id) {
    return { title: 'Content Not Found', overview: 'This content is currently unavailable.', recommendations: { results: [] } };
  }
  return details;
};

export const getSeasonDetails = async (tvId, seasonNumber) => {
  return fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);
};

export const getAnime = async () => {
  return fetchFromTMDB('/discover/tv', { 
    with_genres: '16', 
    with_original_language: 'ja',
    sort_by: 'popularity.desc'
  });
};
