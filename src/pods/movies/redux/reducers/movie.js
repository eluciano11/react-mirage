import {
  MOVIE_STATES,
  MOVIE_EVENTS,
  MOVIE_EDIT_EVENTS,
  MOVIE_EDIT_STATES,
} from "../constants";

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

const movieEditInitialState = {
  status: MOVIE_EDIT_STATES.idle,
  errors: null,
};

export function MovieEditReducer(state = movieEditInitialState, event) {
  switch (state.status) {
    case MOVIE_EDIT_STATES.failed:
    case MOVIE_EDIT_STATES.idle: {
      // Reduce the scope of what can change my state.
      switch (event.type) {
        case MOVIE_EDIT_EVENTS.submitted: {
          return Object.assign({}, state, {
            status: MOVIE_EDIT_STATES.loading,
            errors: null,
          });
        }

        default: {
          return state;
        }
      }
    }

    case MOVIE_EDIT_STATES.loading: {
      switch (event.type) {
        case MOVIE_EDIT_EVENTS.resolved: {
          return Object.assign({}, state, {
            status: MOVIE_EDIT_STATES.completed,
            errors: null,
          });
        }

        case MOVIE_EDIT_EVENTS.rejected: {
          return Object.assign({}, state, {
            status: MOVIE_EDIT_STATES.failed,
            errors: event.errors,
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
