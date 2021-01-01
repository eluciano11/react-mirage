const MoviesResource = {
  *fetchMovies() {
    const res = yield fetch("/movies");

    if (res.status >= 400) {
      throw res;
    }

    const { movies } = yield res.json();

    return movies;
  },
};

export default MoviesResource;
