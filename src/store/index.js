import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import * as MoviesReducers from "../pods/movies/redux/reducers";
import * as MoviesSagas from "../pods/movies/redux/sagas";

// Reducers
const reducers = combineReducers({
  list: MoviesReducers.MoviesListReducer,
});

// Middlewares
const sagaMiddleware = createSagaMiddleware();

// Store
const store = createStore(reducers, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(MoviesSagas.MoviesListSaga);

export default store;
