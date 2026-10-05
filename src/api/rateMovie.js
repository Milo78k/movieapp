import { requestTmdb } from './tmdb';

export async function rateMovie(movieId, value, guestSessionId) {
  if (!guestSessionId) throw new Error('Гостевая сессия ещё не готова.');
  await requestTmdb(`/movie/${movieId}/rating`, {
    method: 'POST',
    params: { guest_session_id: guestSessionId },
    body: JSON.stringify({ value }),
  });
}
