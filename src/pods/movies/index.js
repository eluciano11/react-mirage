import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { Loader } from "../components/index";
import { MOVIES_LIST_STATES, MOVIES_LIST_EVENTS } from "./redux/constants";

export default function Movies() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.list);

  useEffect(() => {
    dispatch({ type: MOVIES_LIST_EVENTS.fetch });

    return () => {
      dispatch({ type: MOVIES_LIST_EVENTS.reset });
    };
  }, [dispatch]);

  switch (state.status) {
    case MOVIES_LIST_STATES.loading: {
      return (
        <div className="w-11/12 m-auto" data-testid="loading">
          <Loader />
        </div>
      );
    }

    case MOVIES_LIST_STATES.failed: {
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

    case MOVIES_LIST_STATES.success: {
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
