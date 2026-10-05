import React, { useState, useEffect } from 'react';
import MoviePoster from '../MoviePoster';
import MovieInfoHeader from '../MovieInfoHeader';
import MovieInfoDescription from '../MovieInfoDescription';
import Rating from '../Rating';
import { rateMovie } from '../../api/rateMovie';
import './MovieCard.css';

function MovieCard({
  movie,
  guestSessionId,
  rating: initialRating,
  onRateSuccess,
}) {
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [rating, setRating] = useState(initialRating || movie.rating || 0);

  useEffect(() => {
    setRating(movie.rating || 0);
  }, [movie.rating]);

  const handleRate = async (value) => {
    setIsSaving(true);
    setError('');
    try {
      await rateMovie(movie.id, value, guestSessionId);
      setRating(value);
      if (onRateSuccess) onRateSuccess();
    } catch (err) {
      setError('Не удалось сохранить оценку. Попробуйте ещё раз.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="movie-card">
      <div className="poster-container">
        <MoviePoster movie={movie} />
      </div>
      <div className="info-header">
        <MovieInfoHeader movie={movie} rating={rating} />
      </div>
      <div className="movie-description">
        <MovieInfoDescription
          movie={movie}
          rating={rating}
          rateMovie={handleRate}
        />
      </div>
      <div className="movie-rating">
        <Rating
          value={rating}
          onChange={handleRate}
          disabled={isSaving || !guestSessionId}
        />
        {error && <p role="alert">{error}</p>}
      </div>
    </div>
  );
}

export default MovieCard;
