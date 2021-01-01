import { all, call, put, takeLatest } from "redux-saga/effects";

import MovieResource from "../../resource";
import { MOVIE_EVENTS } from "../constants";

function* fetchMovieDetails({ id }) {
  try {
    yield put({ type: MOVIE_EVENTS.fetching, data: [] });

    let movie = yield call(MovieResource.fetchMovieDetails, id);

    yield put({ type: MOVIE_EVENTS.resolved, data: movie });
  } catch (error) {
    yield put({ type: MOVIE_EVENTS.rejected, errors: error.errors });
  }
}

export function* MovieSaga() {
  yield all([yield takeLatest(MOVIE_EVENTS.fetch, fetchMovieDetails)]);
}
