/* eslint-env jest */
import { searchMovies } from './movies';
import { rateMovie } from './rateMovie';
import { createGuestSessionProvider } from './guestSession';

const originalFetch = global.fetch;
afterEach(() => {
  global.fetch = originalFetch;
  delete process.env.REACT_APP_TMDB_API_KEY;
});

test('search text is encoded instead of becoming additional query parameters', async () => {
  process.env.REACT_APP_TMDB_API_KEY = 'test-key';
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ results: [], total_results: 0 }),
  });
  await searchMovies('Batman & Robin #1', 2);
  const url = new URL(global.fetch.mock.calls[0][0]);
  expect(url.searchParams.get('query')).toBe('Batman & Robin #1');
  expect(url.searchParams.get('page')).toBe('2');
});
test('failed rating rejects so the UI cannot show a false success', async () => {
  process.env.REACT_APP_TMDB_API_KEY = 'test-key';
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 });
  await expect(rateMovie(1, 7, 'session')).rejects.toThrow('401');
});
test('concurrent session consumers share creation and failures can be retried', async () => {
  const create = jest
    .fn()
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValue('session');
  const getSession = createGuestSessionProvider(create);
  await expect(getSession()).rejects.toThrow('offline');
  expect(await Promise.all([getSession(), getSession()])).toEqual([
    'session',
    'session',
  ]);
  expect(create).toHaveBeenCalledTimes(2);
});
test('missing configuration produces an actionable error without a request', async () => {
  global.fetch = jest.fn();
  await expect(searchMovies('Batman')).rejects.toThrow(
    'REACT_APP_TMDB_API_KEY',
  );
  expect(global.fetch).not.toHaveBeenCalled();
});
