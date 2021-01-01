function NetworkError({ res, data }) {
  this.type = res.status === 403 ? "ForbiddenError" : "UnhandledError";
  this.errors = data.errors || {};
}

const MoviesResource = {
  *fetchMovies() {
    const res = yield fetch("/movies");

    if (res.status >= 400) {
      throw res;
    }

    const { movies } = yield res.json();

    return movies;
  },

  *fetchMovieDetails(id) {
    const res = yield fetch(`/movies/${id}`);
    const data = yield res.json();

    if (res.status >= 200 && res.status <= 299) {
      return data.movie;
    } else {
      throw new NetworkError({ res, data });
    }
  },

  *createMovie(cleanData) {
    const res = yield fetch("/movies", {
      method: "POST",
      body: JSON.stringify({
        data: { type: "movies", attributes: cleanData },
      }),
    });
    const data = yield res.json();

    if (res.status >= 200 && res.status <= 299) {
      return data;
    } else {
      throw new NetworkError({ res, data });
    }
  },

  *updateMovie(id, cleanData) {
    const res = yield fetch(`/movies/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        data: { type: "movies", attributes: cleanData },
      }),
    });
    const data = yield res.json();

    if (res.status >= 200 && res.status <= 299) {
      return data;
    } else {
      throw new NetworkError({ res, data });
    }
  },
};

export default MoviesResource;
