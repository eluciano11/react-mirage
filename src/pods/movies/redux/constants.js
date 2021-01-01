// Events that will trigger a transition on our state.
export const MOVIES_LIST_EVENTS = {
  fetch: "movies-list/FETCH",
  fetching: "movies-list/FETCHING",
  resolved: "movies-list/RESOLVED",
  rejected: "movies-list/REJECTED",
};

export const MOVIES_LIST_STATES = {
  idle: "IDLE",
  loading: "LOADING",
  success: "SUCCESS",
  failed: "FAILED",
};

export const MOVIE_STATES = {
  idle: "IDLE",
  loading: "LOADING",
  failed: "FAILED",
  success: "SUCCESS",
};

export const MOVIE_EVENTS = {
  fetch: "movie/FETCH",
  fetching: "movie/FETCHING",
  resolved: "movie/RESOLVED",
  rejected: "movie/REJECTED",
};

// Possible states of our component.
export const MOVIE_EDIT_STATES = {
  idle: "IDLE",
  loading: "LOADING",
  failed: "FAILED",
  completed: "COMPLETED",
};

// Events that can trigger transitions on your states.
export const MOVIE_EDIT_EVENTS = {
  create: "movie-edit/CREATE",
  update: "movie-edit/UPDATE",
  submitted: "movie-edit/SUBMITTED",
  resolved: "movie-edit/RESOLVED",
  rejected: "movie-edit/REJECTED",
};
