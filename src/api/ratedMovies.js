import { requestTmdb } from './tmdb';

export const fetchRatedMovies = async (guestSessionId, page = 1) => {
  if (!guestSessionId) throw new Error('Гостевая сессия ещё не готова.');
  const data = await requestTmdb(
    `/guest_session/${guestSessionId}/rated/movies`,
    { params: { page } },
  );
  return { movies: data.results || [], totalPages: data.total_pages || 0 };
};
