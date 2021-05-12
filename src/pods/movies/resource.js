import api from "../../service/api";

const MoviesResource = {
  getAllMovies() {
    return api.get("/movies");
  },

  getMovie(id) {
    return api.get(`/movies/${id}`);
  },

  createMovie(params) {
    return api.post("/movies", params);
  },

  updateMovie(id, params) {
    return api.patch(`/movies/${id}`, params);
  },

  deleteMovie(id) {
    return api.delete(`/movies/${id}`);
  },
};

export default MoviesResource;
