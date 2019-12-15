import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await fetch('/movies');

        if (res.status >= 400) {
          throw res;
        }

        const { movies } = await res.json();

        setHasError(false);
        setLoading(false);
        setMovies(movies);
      } catch (error) {
        setLoading(false);
        setHasError(true);
        setMovies([]);
      }
    };

    getMovies();
  }, []);

  if (hasError) {
    return <div data-testid="errorMovies">Sorry, we found an error!</div>;
  }

  if (loading) {
    return <div data-testid="loadingMovies">Loading...</div>;
  }

  if (movies.length === 0) {
    return <div data-testid="emptyMovies">No movies to show :(</div>;
  }

  return (
    <div data-testid="movieList">
      <Link to="/add">Add a movie</Link>
      <ul>
        {movies.map((movie, index) => (
          <li key={index} data-testid="movie">
            <Link to={`/${movie.id}`}>
              {movie.title} {movie.release}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
