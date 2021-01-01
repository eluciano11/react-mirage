import { MOVIES_LIST_EVENTS, MOVIES_LIST_STATES } from "../constants";

const initialState = {
  status: MOVIES_LIST_STATES.idle,
  data: [],
};

export function MoviesListReducer(state = initialState, events) {
  console.log({ state, events });

  switch (state.status) {
    case MOVIES_LIST_STATES.idle: {
      switch (events.type) {
        case MOVIES_LIST_EVENTS.fetching: {
          return Object.assign({}, state, {
            status: MOVIES_LIST_STATES.loading,
            data: [],
          });
        }

        default: {
          return state;
        }
      }
    }

    case MOVIES_LIST_STATES.loading: {
      switch (events.type) {
        case MOVIES_LIST_EVENTS.resolved: {
          return Object.assign({}, state, {
            status: MOVIES_LIST_STATES.success,
            data: events.data,
          });
        }

        case MOVIES_LIST_EVENTS.rejected: {
          return Object.assign({}, state, {
            status: MOVIES_LIST_STATES.failed,
            data: [],
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
