import { requestTmdb } from './tmdb';

export const fetchGenres = async () => {
  try {
    const data = await requestTmdb('/genre/movie/list');
    return data.genres;
  } catch {
    return [];
  }
};
