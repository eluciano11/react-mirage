import { MOVIE_STATES, MOVIE_EVENTS } from "../constants";

const initialState = {
  status: MOVIE_STATES.idle,
  data: {},
  errors: null,
};

export function MovieReducer(state = initialState, action) {
  switch (state.status) {
    case MOVIE_STATES.idle: {
      switch (action.type) {
        case MOVIE_EVENTS.fetching: {
          return Object.assign({}, state, {
            status: MOVIE_STATES.loading,
            errors: null,
          });
        }

        default: {
          return state;
        }
      }
    }

    case MOVIE_STATES.loading: {
      switch (action.type) {
        case MOVIE_EVENTS.resolved: {
          return Object.assign({}, state, {
            status: MOVIE_STATES.success,
            data: action.data,
            errors: null,
          });
        }

        case MOVIE_EVENTS.rejected: {
          return Object.assign({}, state, {
            status: MOVIE_STATES.failed,
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
