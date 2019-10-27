import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      const res = await fetch('/movies');
      const { movies } = await res.json();

      setLoading(false);
      setMovies(movies);
    };

    getMovies();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to="/add">Add a movie</Link>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <Link to={`/${movie.id}`}>
              {movie.title} {movie.release}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
