import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import * as MoviesReducers from "../pods/movies/redux/reducers";
import * as MoviesSagas from "../pods/movies/redux/sagas";

// Reducers
const reducers = combineReducers({
  list: MoviesReducers.MoviesListReducer,
  movie: MoviesReducers.MovieReducer,
  edit: MoviesReducers.MovieEditReducer,
});

// Middlewares
const sagaMiddleware = createSagaMiddleware();

// Store
const store = createStore(reducers, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(MoviesSagas.MoviesListSaga);
sagaMiddleware.run(MoviesSagas.MovieSaga);

export default store;
