import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function NetworkError({ res, data }) {
  this.type = res.status === 403 ? 'ForbiddenError' : 'UnhandledError';
  this.errors = data.errors || {};
}

const STATES = {
  idle: 'IDLE',
  loading: 'LOADING',
  failed: 'FAILED',
  completed: 'COMPLETED'
};

const EVENTS = {
  fetch: 'FETCH',
  resolved: 'RESOLVED',
  rejected: 'REJECTED'
};

const initialState = {
  status: STATES.idle,
  data: null,
  errors: null
};

function reducer(state = initialState, action) {
  switch (state.status) {
    case STATES.idle: {
      switch (action.type) {
        case EVENTS.fetch: {
          return Object.assign({}, state, {
            status: STATES.loading,
            errors: null
          });
        }

        default: {
          return state;
        }
      }
    }

    case STATES.loading: {
      switch (action.type) {
        case EVENTS.resolved: {
          return Object.assign({}, state, {
            status: STATES.completed,
            data: action.data,
            errors: null
          });
        }

        case EVENTS.rejected: {
          return Object.assign({}, state, {
            status: STATES.failed,
            data: null,
            errors: action.errors
          });
        }

        default: {
          return state;
        }
      }
    }

    default: {
      return state;
    }
  }
}

function useMovie() {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const [errors, setErrors] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getMovie = async () => {
      debugger;
      try {
        const res = await fetch(`/movies/${id}`);
        const data = await res.json();

        if (res.status >= 200 && res.status <= 299) {
          console.log('testing');
          setLoading(false);
          setMovie(data.movie);
          setErrors(null);
        } else {
          throw new NetworkError({ res, data });
        }
      } catch (error) {
        console.log({ error });
        setLoading(false);
        setMovie({});
        setErrors(error.errors);
      }
    };

    getMovie();
  }, [id]);

  debugger;
  console.log({ loading, movie, errors });

  return { loading, movie, errors };
}

export default useMovie;
