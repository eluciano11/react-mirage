import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import { MOVIE_EDIT_EVENTS, MOVIE_EDIT_STATES } from "../redux/constants";

const GENERIC_ERROR = {
  general: "Ops! Something went wrong, please try again!",
};

function FormValidationError({ errors }) {
  this.type = "FormValidationError";
  this.errors = errors;
}

function hasContent({ field }) {
  if (field && field != null) {
    return {
      isValid: true,
      cleanData: field,
      error: null,
    };
  }

  return {
    isValid: false,
    cleanData: null,
    error: "This field is required.",
  };
}

function validateForm({ fields }) {
  let allFieldsValid = true;

  const result = Object.keys(fields).reduce(
    (prev, current) => {
      let entry = fields[current];

      if (!entry.isValid) {
        allFieldsValid = false;

        return {
          ...prev,
          errors: {
            ...prev.errors,
            [current]: entry.error,
          },
        };
      }

      return {
        ...prev,
        cleanData: {
          ...prev.cleanData,
          [current]: entry.cleanData,
        },
      };
    },
    { cleanData: {}, errors: {} }
  );

  if (allFieldsValid) {
    return { cleanData: result.cleanData };
  }

  throw new FormValidationError({ errors: result.errors });
}

export default function MovieForm({ title, release, synopsis, isEditing }) {
  const titleRef = useRef(title || null);
  const releaseRef = useRef(release || null);
  const synopsisRef = useRef(synopsis || null);
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return {
      ...state.edit,
    };
  });

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const fields = {
          title: hasContent({ field: titleRef.current.value }),
          release: hasContent({ field: releaseRef.current.value }),
          synopsis: hasContent({ field: synopsisRef.current.value }),
        };
        const { cleanData } = validateForm({ fields });

        if (isEditing) {
          dispatch({ type: MOVIE_EDIT_EVENTS.update, cleanData, id });
        } else {
          dispatch({ type: MOVIE_EDIT_EVENTS.create, cleanData });
        }
      } catch (error) {
        const errors =
          error.type === "FormValidationError" ? error.errors : GENERIC_ERROR;

        dispatch({ type: MOVIE_EDIT_EVENTS.rejected, errors });
      }
    },
    [id, isEditing, dispatch]
  );

  return (
    <div>
      {state.status === MOVIE_EDIT_STATES.failed && (
        <p className="text-red-500" data-testid="general-error">
          {state.errors.general}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="title">
            Title
          </label>
          <input
            ref={titleRef}
            className="py-1 px-2 border rounded w-full mb-1"
            id="title"
            type="text"
            data-testid="title"
            defaultValue={title}
            disabled={state.status === MOVIE_EDIT_STATES.loading}
          />
          {state.status === MOVIE_EDIT_STATES.failed && (
            <p className="text-xs text-red-500" data-testid="title-error">
              {state.errors.title}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="release">
            Release date
          </label>
          <input
            ref={releaseRef}
            className="py-1 px-2 border rounded w-full mb-1"
            id="release"
            type="text"
            data-testid="release"
            defaultValue={release}
            disabled={state.status === MOVIE_EDIT_STATES.loading}
          />
          {state.status === MOVIE_EDIT_STATES.failed && (
            <p className="text-xs text-red-500" data-testid="release-error">
              {state.errors.release}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="synopsis">
            Synopsis
          </label>
          <textarea
            ref={synopsisRef}
            className="py-1 px-2 border rounded w-full mb-1"
            name="synopsis"
            id="synopsis"
            cols="30"
            rows="10"
            data-testid="synopsis"
            defaultValue={synopsis}
            disabled={state.status === MOVIE_EDIT_STATES.loading}
          ></textarea>
          {state.status === MOVIE_EDIT_STATES.failed && (
            <p className="text-xs text-red-500" data-testid="synopsis-error">
              {state.errors.synopsis}
            </p>
          )}
        </div>
        <button
          className="inline-block px-5 py-3 bg-green-500 rounded text-white font-semibold text-right"
          type="submit"
          data-testid="submit"
          disabled={state.status === MOVIE_EDIT_STATES.loading}
        >
          {state.status === MOVIE_EDIT_STATES.loading
            ? "Submitting..."
            : "Submit"}
        </button>
      </form>
    </div>
  );
}
