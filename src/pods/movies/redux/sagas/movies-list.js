import { all, call, put, takeLatest } from "redux-saga/effects";

import MoviesResource from "../../resource";
import { MOVIES_LIST_EVENTS } from "../constants";

function* fetchMoviesHandler() {
  try {
    yield put({ type: MOVIES_LIST_EVENTS.fetching, data: [] });

    const movies = yield call(MoviesResource.fetchMovies);

    yield put({ type: MOVIES_LIST_EVENTS.resolved, data: movies });
  } catch (error) {
    yield put({ type: MOVIES_LIST_EVENTS.rejected });
  }
}

export function* MoviesListSaga() {
  yield all([yield takeLatest(MOVIES_LIST_EVENTS.fetch, fetchMoviesHandler)]);
}
