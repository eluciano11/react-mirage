import MoviesResource from "../pods/movies/resource";
import MovieStore from "./movie";

export default class RootStore {
  constructor() {
    this.movieStore = new MovieStore(MoviesResource);
  }
}
