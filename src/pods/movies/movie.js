import React, { useCallback } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import { useMovie } from '../../hooks/index';

export default function() {
  const { loading, movie } = useMovie();
  const history = useHistory();
  const { id } = useParams();

  const handleDelete = useCallback(async () => {
    await fetch(`/movies/${id}`, { method: 'DELETE' });

    history.push('/');
  }, [history, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img
        src={movie.poster}
        alt="movie poster"
        style={{ height: 300, width: 300 }}
      />
      <h3>{movie.title}</h3>
      <p>{movie.release}</p>
      <p>{movie.synopsis}</p>
      <button onClick={handleDelete}>Delete</button>
      <Link to={`/${id}/edit`}>Edit</Link>
    </div>
  );
}
