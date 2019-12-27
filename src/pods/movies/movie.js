import React, { useCallback, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import { useMovie } from './hooks/index';

export default function() {
  const { loading, movie } = useMovie();
  const history = useHistory();
  const { id } = useParams();
  const [isDeleting, setDelete] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = useCallback(async () => {
    try {
      setDelete(true);
      await fetch(`/movies/${id}`, { method: 'DELETE' });

      history.push('/');
    } catch (error) {
      setError({
        general:
          'Ops! Something went wrong while deleting your movie, please try again!'
      });
    }
  }, [history, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <p>{error.general}</p>}
      <img
        src={movie.poster}
        alt="movie poster"
        style={{ height: 300, width: 300 }}
      />
      <h3>{movie.title}</h3>
      <p>{movie.release}</p>
      <p>{movie.synopsis}</p>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
      <Link to={`/${id}/edit`} disabled={isDeleting}>
        Edit
      </Link>
    </div>
  );
}
