import React, { useCallback, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import { useMovie } from './hooks/index';

const GENERIC_ERROR = {
  general:
    'Ops! Something went wrong while deleting your movie, please try again!'
};

function NetworkError({ res, data }) {
  this.type = res.status === 403 ? 'ForbiddenError' : 'UnhandledError';
  this.errors = data.errors;
}

export default function() {
  const movie = useMovie();
  const history = useHistory();
  const { id } = useParams();
  const [isDeleting, setDelete] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = useCallback(async () => {
    try {
      setDelete(true);
      const res = await fetch(`/movies/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.status >= 200 && res.status <= 299) {
        history.push('/');
      } else {
        throw new NetworkError({ res, data });
      }
    } catch (error) {
      let errors = error.errors || GENERIC_ERROR;

      setDelete(false);
      setError(errors);
    }
  }, [history, id]);

  switch (movie.status) {
    case 'LOADING': {
      return <div>Loading...</div>;
    }

    case 'FAILED': {
      return (
        <div data-testid="movie-loading-error">
          Ops! An error occurred while loading the movie.
        </div>
      );
    }

    case 'SUCCESS': {
      return (
        <div data-testid="movie-details">
          {error && <p data-testid="general-error">{error.general}</p>}
          <img
            src={movie.poster}
            alt="movie poster"
            style={{ height: 300, width: 300 }}
          />
          <h3 data-testid="title">{movie.data.title}</h3>
          <p data-testid="release">{movie.data.release}</p>
          <p data-testid="synopsis">{movie.data.synopsis}</p>
          <button
            onClick={handleDelete}
            data-testid="delete"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <Link to={`/${id}/edit`} disabled={isDeleting}>
            Edit
          </Link>
        </div>
      );
    }

    default: {
      return null;
    }
  }
}
