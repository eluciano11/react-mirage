import React, { useCallback, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import { Modal } from '../components/index';
import { useMovie } from './hooks/index';

const GENERIC_ERROR = {
  general:
    'Ops! Something went wrong while deleting your movie, please try again!'
};

function NetworkError({ res, data }) {
  this.type = res.status === 403 ? 'ForbiddenError' : 'UnhandledError';
  this.errors = data.errors;
}

export default function Movie() {
  const movie = useMovie();
  const history = useHistory();
  const { id } = useParams();
  const [isDeleting, setDelete] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirming, setConfirm] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      setDelete(true);
      const res = await fetch(`/movies/${id}`, { method: 'DELETE' });

      if (res.status >= 200 && res.status <= 299) {
        history.push('/');
      } else {
        const data = await res.json();

        throw new NetworkError({ res, data });
      }
    } catch (error) {
      let errors = error.errors || GENERIC_ERROR;

      setDelete(false);
      setError(errors);
    }
  }, [history, id]);

  const toggleConfirm = useCallback(() => {
    setConfirm(!isConfirming);
  }, [isConfirming]);

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
          <Modal isOpen={isConfirming}>
            <div>Are you sure you want to close delete this movie?</div>
            <div>
              <button
                onClick={handleDelete}
                data-testid="confirm"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button
                onClick={toggleConfirm}
                data-testid="cancel"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </Modal>
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
            onClick={toggleConfirm}
            data-testid="delete"
            disabled={isDeleting}
          >
            Delete
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
