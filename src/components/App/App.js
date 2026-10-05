import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tabs } from 'antd';
import { createGuestSessionProvider } from '../../api/guestSession';
import { fetchRatedMovies } from '../../api/ratedMovies';
import Movie from '../Movie';
import RatedMovies from '../RatedMovies';
import { GenresProvider } from '../GenresContext';

function App() {
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [sessionError, setSessionError] = useState('');
  const [ratedMovies, setRatedMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [totalPages, setTotalPages] = useState(0);
  const getSession = useMemo(() => createGuestSessionProvider(), []);

  const ensureSession = useCallback(async () => {
    const sessionId = await getSession();
    setGuestSessionId(sessionId);
    setSessionError('');
    return sessionId;
  }, [getSession]);

  const fetchRatedMoviesData = useCallback(
    async (page = 1) => {
      const sessionId = await ensureSession();
      const result = await fetchRatedMovies(sessionId, page);
      setRatedMovies(result.movies);
      setTotalPages(result.totalPages);
    },
    [ensureSession],
  );

  const handleRatingUpdate = () => {
    fetchRatedMoviesData().catch(() =>
      setSessionError('Оценка сохранена, но список Rated не удалось обновить.'),
    );
  };

  const retrySession = useCallback(() => {
    ensureSession().catch((error) => setSessionError(error.message));
  }, [ensureSession]);

  useEffect(() => {
    retrySession();
  }, [retrySession]);

  return (
    <GenresProvider>
      {sessionError && (
        <div role="alert">
          {sessionError}{' '}
          <button type="button" onClick={retrySession}>
            Повторить
          </button>
        </div>
      )}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={[
          {
            key: '1',
            label: 'Search',
            children: (
              <Movie
                guestSessionId={guestSessionId}
                onRateSuccess={handleRatingUpdate}
              />
            ),
          },
          {
            key: '2',
            label: 'Rated',
            children:
              activeTab === '2' ? (
                <RatedMovies
                  ratedMovies={ratedMovies}
                  fetchRatedMovies={fetchRatedMoviesData}
                  totalPages={totalPages}
                  guestSessionId={guestSessionId}
                />
              ) : null,
          },
        ]}
      />
    </GenresProvider>
  );
}
export default App;
