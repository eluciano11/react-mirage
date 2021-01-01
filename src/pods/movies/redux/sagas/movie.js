import { all, call, put, takeLatest } from "redux-saga/effects";

import MovieResource from "../../resource";
import { MOVIE_EDIT_EVENTS, MOVIE_EVENTS } from "../constants";

const GENERIC_ERROR = {
  general: "Ops! Something went wrong, please try again!",
};

function* fetchMovieDetailsHandler({ id }) {
  try {
    yield put({ type: MOVIE_EVENTS.fetching, data: [] });

    let movie = yield call(MovieResource.fetchMovieDetails, id);

    yield put({ type: MOVIE_EVENTS.resolved, data: movie });
  } catch (error) {
    yield put({ type: MOVIE_EVENTS.rejected, errors: error.errors });
  }
}

function* createMovieHadler({ cleanData }) {
  try {
    yield put({ type: MOVIE_EDIT_EVENTS.submitted });

    yield call(MovieResource.createMovie, cleanData);

    yield put({ type: MOVIE_EDIT_EVENTS.resolved });
    // history.push("/");
  } catch (error) {
    const errors = GENERIC_ERROR;

    yield put({ type: MOVIE_EDIT_EVENTS.rejected, errors });
  }
}

function* updateMovieHandler({ id, cleanData }) {
  try {
    yield put({ type: MOVIE_EDIT_EVENTS.submitted });

    yield call(MovieResource.updateMovie, id, cleanData);

    yield put({ type: MOVIE_EDIT_EVENTS.resolved });
    // history.push("/");
  } catch (error) {
    const errors = GENERIC_ERROR;

    yield put({ type: MOVIE_EDIT_EVENTS.rejected, errors });
  }
}

export function* MovieSaga() {
  yield all([
    yield takeLatest(MOVIE_EVENTS.fetch, fetchMovieDetailsHandler),
    yield takeLatest(MOVIE_EDIT_EVENTS.create, createMovieHadler),
    yield takeLatest(MOVIE_EDIT_EVENTS.update, updateMovieHandler),
  ]);
}
