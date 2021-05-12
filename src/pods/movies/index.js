import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { Loader } from "../components/index";
import { useRootStore } from "../../context/root";

// States that our UI could be in.
const STATES = {
  idle: "IDLE",
  loading: "LOADING",
  success: "SUCCESS",
  failed: "FAILED",
};

const Movies = observer(() => {
  const store = useRootStore();
  console.log({ status: store.movieStore.status });

  useEffect(() => {
    store.movieStore.fetchMovies();
  }, []);

  console.log({ status: store.movieStore.status });

  switch (store.movieStore.status) {
    case STATES.loading: {
      return (
        <div className="w-11/12 m-auto" data-testid="loading">
          <Loader />
        </div>
      );
    }

    case STATES.failed: {
      return (
        <div className="w-11/12 m-auto">
          <div data-testid="error">
            Ops! We found an error, please try again.{" "}
            <span role="img" aria-label="sad">
              😥
            </span>
          </div>
        </div>
      );
    }

    case STATES.success: {
      if (store.movieStore.movies.length > 0) {
        return (
          <section className="w-11/12 m-auto" data-testid="list">
            <div className="flex justify-between items-center m-2">
              <h3 className="text-2xl font-semibold">Movies</h3>
              <Link
                className="inline-block px-5 py-3 bg-green-500 rounded text-white font-semibold text-right"
                to="/add"
                data-testid="add-movie"
                id="add-movie"
              >
                Add a movie
              </Link>
            </div>
            <ul className="my-2 overflow-y" data-testid="movies">
              {store.movieStore.movies.map((movie, index) => {
                console.log({ movie });

                return (
                  <li
                    className={`border border-solid border-gray-200 border-r-0 border-l-0 ${
                      index + 1 !== store.movieStore.movies.length
                        ? "border-b-0"
                        : ""
                    }`}
                    key={index}
                    data-testid="movie"
                  >
                    <Link
                      className="block text-lg py-2 px-4 hover:bg-gray-100"
                      to={`/${movie.id}`}
                    >
                      {movie.title} {movie.release}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      }

      return <div data-testid="empty">No movies to show :(</div>;
    }

    default: {
      return null;
    }
  }
});

export default Movies;
