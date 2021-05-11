import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import logger from "redux-logger";

import * as MoviesSagas from "../pods/movies/redux/sagas";
import createRootReducer from "./create-root-reducer";

export const history = createBrowserHistory();

// Middlewares
const sagaMiddleware = createSagaMiddleware();

// Store
const store = createStore(
  createRootReducer(history),
  applyMiddleware(logger, routerMiddleware(history), sagaMiddleware)
);

sagaMiddleware.run(MoviesSagas.MoviesListSaga);
sagaMiddleware.run(MoviesSagas.MovieSaga);

export default store;
