// Events that will trigger a transition on our state.
export const MOVIES_LIST_EVENTS = {
  fetch: "FETCH",
  fetching: "FETCHING",
  resolved: "RESOLVED",
  rejected: "REJECTED",
};

export const MOVIES_LIST_STATES = {
  idle: "IDLE",
  loading: "LOADING",
  success: "SUCCESS",
  failed: "FAILED",
};
