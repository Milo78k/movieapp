import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'antd';
import MovieCard from '../MovieCard';
import LoadingSpinner from '../LoadingSpinner';
import ShowAlert from '../ShowAlert/ShowAlert';
import PaginationComponent from '../PaginationComponent';
import SearchInput from '../ SearchInput';
import './Movie.css';
import { searchMovies } from '../../api/movies';

function Movie({ guestSessionId, onRateSuccess }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchMovies = useCallback(
    async (signal) => {
      if (!query.trim()) {
        setMovies([]);
        setTotalResults(0);
        setLoading(false);
        setError('');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const { movies: fetchedMovies, totalResults: fetchedTotal } =
          await searchMovies(query, page, signal);
        if (signal.aborted) return;
        setMovies(fetchedMovies);
        setTotalResults(fetchedTotal);
      } catch {
        if (!signal.aborted) setError('Не удалось загрузить данные.');
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [query, page],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchMovies(controller.signal);
    return () => controller.abort();
  }, [fetchMovies]);

  return (
    <div className="movie">
      <SearchInput query={query} setQuery={setQuery} setPage={setPage} />
      {loading && <LoadingSpinner />}
      {error && <ShowAlert message={error} type="error" />}
      {movies.length === 0 && query && !loading && <p>Ничего не найдено</p>}
      <Row gutter={[16, 16]} justify="center">
        {movies.map((movie) => (
          <Col
            key={movie.id}
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ margin: '0' }}
          >
            <MovieCard
              movie={movie}
              guestSessionId={guestSessionId}
              onRateSuccess={onRateSuccess}
            />
          </Col>
        ))}
      </Row>
      <div className="pagination-wrapper">
        <PaginationComponent
          current={page}
          total={totalResults}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default Movie;
