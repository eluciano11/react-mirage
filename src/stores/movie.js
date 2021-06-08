import { nanoid } from "nanoid";
import { makeObservable, observable, action, makeAutoObservable } from "mobx";

const GENERIC_ERROR = {
  general: "Ops! Something went wrong, please try again!",
};

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
  errors = null;

  constructor(resource) {
    makeObservable(this, {
      movies: observable,
      status: observable,
      currentMovieId: observable,
      fetchMovies: action,
      fetchMovie: action,
      createMovie: action,
      updateMovie: action,
      deleteMovie: action,
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
    } catch (errors) {
      this.status = STATES.failed;
      this.errors = errors;
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
      } catch (errors) {
        this.status = STATES.failed;
        this.errors = errors;
      }
    } else {
      this.status = STATES.success;
    }
  }

  async createMovie(data) {
    this.status = STATES.loading;

    try {
      const json = await this.resource.createMovie(data);
      const movie = new Movie(this, json.id);

      movie.updateFromJson(json.movie);
      this.status = STATES.success;
    } catch (errors) {
      this.status = STATES.failed;
      this.errors = GENERIC_ERROR;
    }
  }

  async updateMovie(data) {
    this.status = STATES.loading;

    try {
      const json = await this.resource.updateMovie(this.currentMovieId, data);

      this.updateTodoFromServer(json.movie);
      this.status = STATES.success;
    } catch (errors) {
      this.status = STATES.failed;
      this.errors = GENERIC_ERROR;
    }
  }

  async deleteMovie(id) {
    this.status = STATES.loading;

    try {
      await this.resource.deleteMovie(id);

      this.movies = this.movies.filter((movie) => movie.id !== id);
      this.status = STATES.success;
    } catch (errors) {
      this.status = STATES.failed;
      this.errors = errors;
    }
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

  async update(data) {
    await this.store.updateMovie(this.id, data);
  }

  async delete() {
    await this.store.deleteMovie(this.id);
  }

  updateFromJson(json) {
    this.title = json.title;
    this.synopsis = json.synopsis;
    this.poster = json.poster;
    this.release = json.release;
  }
}
