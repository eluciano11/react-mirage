import { nanoid } from "nanoid";
import { makeObservable, observable, action, makeAutoObservable } from "mobx";

// States that our UI could be in.
const STATES = {
  idle: "IDLE",
  loading: "LOADING",
  success: "SUCCESS",
  failed: "FAILED",
};

export default class MovieStore {
  resource;
  movies = [];
  status = STATES.idle;
  currentMovieId = null;

  constructor(resource) {
    makeObservable(this, {
      movies: observable,
      status: observable,
      currentMovieId: observable,
      fetchMovies: action,
      fetchMovie: action,
      removeMovie: action,
    });
    this.resource = resource;
  }

  get currentMovie() {
    if (this.currentMovieId) {
      const selectedMovie = this.movies.find(
        (m) => m.id === this.currentMovieId
      );

      return selectedMovie || {};
    }

    return {};
  }

  async fetchMovies() {
    this.status = STATES.loading;

    try {
      const { movies } = await this.resource.getAllMovies();

      movies.forEach((movie) => {
        this.updateTodoFromServer(movie);
      });
      this.status = STATES.success;
    } catch {
      this.status = STATES.failed;
    }
  }

  async fetchMovie(id) {
    this.currentMovieId = id;

    const hasMovie = this.movies.find((m) => m.id === id);

    if (!hasMovie) {
      this.status = STATES.loading;

      try {
        const { movie } = await this.resource.getMovie(id);

        this.updateTodoFromServer(movie);
        this.status = STATES.success;
      } catch {
        this.status = STATES.failed;
      }
    } else {
      this.status = STATES.success;
    }
  }

  removeMovie(id) {
    this.movies = this.movies.filter((movie) => movie.id !== id);
  }

  updateTodoFromServer(json) {
    const foundMovie = this.movies.find((m) => m.id === json.id);

    if (!foundMovie) {
      const movie = new Movie(this, json.id);

      movie.updateFromJson(json);
      this.movies.push(movie);
    } else {
      foundMovie.updateFromJson(json);
    }
  }
}

class Movie {
  id;
  title;
  synopsis;
  poster;
  release;

  store;

  constructor(store, id = nanoid()) {
    makeAutoObservable(this);

    this.store = store;
    this.id = id;
  }

  async delete() {
    await this.store.resource.deleteMovie(this.id);

    this.store.removeMovie(this.id);
  }

  updateFromJson(json) {
    this.title = json.title;
    this.synopsis = json.synopsis;
    this.poster = json.poster;
    this.release = json.release;
  }
}
