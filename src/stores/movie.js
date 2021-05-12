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

  constructor(resource) {
    makeObservable(this, {
      movies: observable,
      status: observable,
      fetchMovies: action,
    });
    this.resource = resource;
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

  updateTodoFromServer(json) {
    const foundMovie = this.movies.find((m) => m.id === json.id);

    if (!foundMovie) {
      const movie = new Movie(this, json.id);

      console.log({ json });

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

  updateFromJson(json) {
    this.title = json.title;
    this.synopsis = json.synopsis;
    this.poster = json.poster;
    this.release = json.release;
  }
}
