import { requestTmdb } from './tmdb';

export async function searchMovies(query, page = 1, signal = undefined) {
  const json = await requestTmdb('/search/movie', {
    params: { query, page },
    signal,
  });
  return { movies: json.results, totalResults: json.total_results };
}
