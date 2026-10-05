export const requestTmdb = async (path, { params = {}, ...options } = {}) => {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey)
    throw new Error(
      'Укажите REACT_APP_TMDB_API_KEY в конфигурации приложения.',
    );
  const query = new URLSearchParams({ ...params, api_key: apiKey });
  const response = await fetch(`https://api.themoviedb.org/3${path}?${query}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...options.headers,
    },
  });
  if (!response.ok)
    throw new Error(`TMDB: ошибка запроса (${response.status})`);
  return response.json();
};
