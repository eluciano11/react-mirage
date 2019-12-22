import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';

const STATES = {
  idle: 'IDLE',
  loading: 'LOADING',
  success: 'SUCCESS',
  failed: 'FAILED'
};
const EVENTS = {
  fetch: 'FETCH',
  resolved: 'RESOLVED',
  rejected: 'REJECTED'
};

const initialState = {
  status: STATES.idle,
  data: []
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case EVENTS.fetch: {
      return Object.assign({}, state, {
        status: STATES.loading,
        data: []
      });
    }

    case EVENTS.resolved: {
      return Object.assign({}, state, {
        status: STATES.success,
        data: action.data
      });
    }

    case EVENTS.rejected: {
      return Object.assign({}, state, {
        status: STATES.failed,
        data: []
      });
    }

    default: {
      return state;
    }
  }
}

export default function() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await fetch('/movies');

        if (res.status >= 400) {
          throw res;
        }

        const { movies } = await res.json();

        return dispatch({ type: EVENTS.resolved, data: movies });
      } catch (error) {
        return dispatch({ type: EVENTS.rejected });
      }
    };

    dispatch({ type: EVENTS.fetch });
    getMovies();
  }, []);

  switch (state.status) {
    case STATES.loading: {
      return <div data-testid="loading">Loading...</div>;
    }

    case STATES.failed: {
      return <div data-testid="error">Sorry, we found an error!</div>;
    }

    case STATES.success: {
      if (state.data.length > 0) {
        return (
          <div data-testid="list">
            <Link to="/add">Add a movie</Link>
            <ul>
              {state.data.map((movie, index) => (
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

      return <div data-testid="empty">No movies to show :(</div>;
    }

    default: {
      return null;
    }
  }
}
