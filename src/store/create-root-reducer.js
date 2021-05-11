import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import * as MoviesReducers from "../pods/movies/redux/reducers";

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    list: MoviesReducers.MoviesListReducer,
    movie: MoviesReducers.MovieReducer,
    edit: MoviesReducers.MovieEditReducer,
  });
}
