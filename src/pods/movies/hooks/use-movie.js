import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

import MoviesResource from "../resource";

const STATES = {
  idle: "IDLE",
  loading: "LOADING",
  failed: "FAILED",
  success: "SUCCESS",
};

const EVENTS = {
  fetch: "FETCH",
  resolved: "RESOLVED",
  rejected: "REJECTED",
};

const initialState = {
  status: STATES.idle,
  data: {},
  errors: null,
};

function reducer(state = initialState, action) {
  switch (state.status) {
    case STATES.idle: {
      switch (action.type) {
        case EVENTS.fetch: {
          return Object.assign({}, state, {
            status: STATES.loading,
            errors: null,
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
            status: STATES.success,
            data: action.data,
            errors: null,
          });
        }

        case EVENTS.rejected: {
          return Object.assign({}, state, {
            status: STATES.failed,
            data: {},
            errors: action.errors,
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { id } = useParams();

  useEffect(() => {
    const getMovie = async () => {
      try {
        const data = await MoviesResource.getMovie(id);

        dispatch({ type: EVENTS.resolved, data: data.movie });
      } catch (error) {
        dispatch({ type: EVENTS.rejected, errors: error.errors });
      }
    };

    dispatch({ type: EVENTS.fetch });
    getMovie();
  }, [id]);

  return state;
}

export default useMovie;
