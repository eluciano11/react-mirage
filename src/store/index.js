import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import * as MoviesReducers from "../pods/movies/redux/reducers";
import * as MoviesSagas from "../pods/movies/redux/sagas";

export const history = createBrowserHistory();

// Reducers
const reducers = combineReducers({
  router: connectRouter(history),
  list: MoviesReducers.MoviesListReducer,
  movie: MoviesReducers.MovieReducer,
  edit: MoviesReducers.MovieEditReducer,
});

// Middlewares
const sagaMiddleware = createSagaMiddleware();

// Store
const store = createStore(
  reducers,
  applyMiddleware(routerMiddleware(history), sagaMiddleware)
);

sagaMiddleware.run(MoviesSagas.MoviesListSaga);
sagaMiddleware.run(MoviesSagas.MovieSaga);

export default store;
