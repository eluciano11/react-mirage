import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";

import { Loader } from "../components/index";
import MoviesResource from "./resource";

// States that our UI could be in.
const STATES = {
  idle: "IDLE",
  loading: "LOADING",
  success: "SUCCESS",
  failed: "FAILED",
};

// Events that will trigger a transition on our state.
const EVENTS = {
  fetch: "FETCH",
  resolved: "RESOLVED",
  rejected: "REJECTED",
};

const initialState = {
  status: STATES.idle,
  data: [],
};

function reducer(state = initialState, events) {
  switch (state.status) {
    case STATES.idle: {
      switch (events.type) {
        case EVENTS.fetch: {
          return Object.assign({}, state, {
            status: STATES.loading,
            data: [],
          });
        }

        default: {
          return state;
        }
      }
    }

    case STATES.loading: {
      switch (events.type) {
        case EVENTS.resolved: {
          return Object.assign({}, state, {
            status: STATES.success,
            data: events.data,
          });
        }

        case EVENTS.rejected: {
          return Object.assign({}, state, {
            status: STATES.failed,
            data: [],
          });
        }

        default: {
          return state;
        }
      }
    }

    default: {
      return state;
    }
  }
}

export default function Movies() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const { movies } = await MoviesResource.getAllMovies();

        return dispatch({ type: EVENTS.resolved, data: movies });
      } catch (error) {
        return dispatch({ type: EVENTS.rejected });
      }
    };

    dispatch({ type: EVENTS.fetch });
    getMovies();
  }, []);

  switch (state.status) {
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
      if (state.data.length > 0) {
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
              {state.data.map((movie, index) => (
                <li
                  className={`border border-solid border-gray-200 border-r-0 border-l-0 ${
                    index + 1 !== state.data.length ? "border-b-0" : ""
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
              ))}
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
}
