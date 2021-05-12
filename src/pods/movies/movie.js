import React, { useCallback, useReducer } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { Loader, Modal } from "../components/index";
import { useMovie } from "./hooks/index";
import MoviesResource from "./resource";

const GENERIC_ERROR = {
  general:
    "Ops! Something went wrong while deleting your movie, please try again!",
};

const STATES = {
  idle: "IDLE",
  confirming: "CONFIRMING",
  loading: "LOADING",
  failed: "FAILED",
};

const EVENTS = {
  delete: "DELETE",
  confirmed: "CONFIRMED",
  canceled: "CANCELED",
  resolved: "RESOLVED",
  rejected: "REJECTED",
};

const initialState = {
  status: STATES.idle,
  errors: null,
};

function reducer(state = initialState, events) {
  switch (state.status) {
    case STATES.idle: {
      switch (events.type) {
        case EVENTS.delete: {
          return Object.assign({}, state, {
            status: STATES.confirming,
            errors: null,
          });
        }

        default: {
          return state;
        }
      }
    }

    case STATES.failed:
    case STATES.confirming: {
      switch (events.type) {
        case EVENTS.canceled: {
          return Object.assign({}, state, {
            status: STATES.idle,
            errors: null,
          });
        }

        case EVENTS.confirmed: {
          return Object.assign({}, state, {
            status: STATES.loading,
            errors: null,
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
            status: STATES.idle,
            errors: null,
          });
        }

        case EVENTS.rejected: {
          return Object.assign({}, state, {
            status: STATES.failed,
            errors: events.errors,
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

export default function Movie() {
  const movie = useMovie();
  const history = useHistory();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDelete = useCallback(async () => {
    dispatch({ type: EVENTS.confirmed });

    try {
      await MoviesResource.deleteMovie(id);

      history.push("/");
    } catch (error) {
      let errors = error.errors || GENERIC_ERROR;

      dispatch({ type: EVENTS.rejected, errors });
    }
  }, [history, id]);

  const toggleConfirm = useCallback((action) => {
    dispatch({ type: action });
  }, []);

  switch (movie.status) {
    case "LOADING": {
      return (
        <div className="w-11/12 m-auto">
          <Loader />
        </div>
      );
    }

    case "FAILED": {
      return (
        <div className="w-11/12 m-auto text-center">
          <p data-testid="movie-loading-error">
            Ops! An error occurred while loading the movie.
            <span role="img" aria-label="sad">
              😥
            </span>
          </p>
        </div>
      );
    }

    case "SUCCESS": {
      return (
        <div className="w-11/12 m-auto" data-testid="movie-details">
          {state.status === STATES.failed && (
            <p className="text-red-500" data-testid="general-error">
              {state.errors.general}
            </p>
          )}
          <Modal isOpen={state.status === STATES.confirming}>
            <div>
              <header className="py-2 px-4 border border-solid border-t-0 border-r-0 border-l-0">
                <h4 className="text-xl font-semibold">
                  Are you sure you want to delete this movie?
                </h4>
              </header>
              <p className="py-2 px-4">
                When you delete a movie you won't be able to add it back to your
                list.
              </p>
              <footer className="py-2 px-4 border border-solid border-b-0 border-r-0 border-l-0 pt-2">
                <button
                  className="inline-block px-5 py-3 bg-green-500 rounded text-white font-semibold mr-2"
                  onClick={handleDelete}
                  data-testid="confirm"
                  disabled={state.status === STATES.loading}
                >
                  {state.status === STATES.loading
                    ? "Deleting..."
                    : "Yes, delete"}
                </button>
                <button
                  className="inline-block px-5 py-3 border border-solid rounded font-semibold"
                  onClick={() => toggleConfirm(EVENTS.canceled)}
                  data-testid="cancel"
                  disabled={state.status === STATES.loading}
                >
                  Cancel
                </button>
              </footer>
            </div>
          </Modal>
          <h3 className="text-2xl font-semibold mb-2" data-testid="title">
            {movie.data.title}{" "}
            <span data-testid="release">({movie.data.release})</span>
          </h3>
          <img
            src={movie.data.poster}
            alt="movie poster"
            style={{ height: 300, width: 300 }}
          />
          <p className="m-2" data-testid="synopsis">
            {movie.data.synopsis}
          </p>
          <button
            className="inline-block px-5 py-3 bg-green-500 rounded text-white font-semibold mr-2"
            onClick={() => toggleConfirm(EVENTS.delete)}
            data-testid="delete"
            disabled={state.status === STATES.loading}
          >
            Delete
          </button>
          <Link
            className="inline-block px-5 py-3 border border-solid rounded font-semibold"
            to={`/${id}/edit`}
            disabled={state.status === STATES.loading}
            data-testid="edit"
          >
            Edit
          </Link>
        </div>
      );
    }

    default: {
      return null;
    }
  }
}
