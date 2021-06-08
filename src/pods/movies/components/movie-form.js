import React, { useCallback, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import { useRootStore } from "../../../context/root";

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

// Possible states of our component.
const STATES = {
  idle: "IDLE",
  loading: "LOADING",
  failed: "FAILED",
  completed: "COMPLETED",
};

export default function MovieForm({ isEditing }) {
  const store = useRootStore();
  const history = useHistory();
  const title = isEditing ? store.movieStore.currentMovie.title : "";
  const release = isEditing ? store.movieStore.currentMovie.release : "";
  const synopsis = isEditing ? store.movieStore.currentMovie.synopsis : "";
  const titleRef = useRef(title || null);
  const releaseRef = useRef(release || null);
  const synopsisRef = useRef(synopsis || null);
  const [formErrors, setFormErrors] = useState(null);

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
        const payload = {
          data: {
            type: "movies",
            attributes: cleanData,
          },
        };

        if (isEditing) {
          await store.movieStore.updateMovie(payload);
        } else {
          await store.movieStore.createMovie(payload);
        }

        history.push("/");
      } catch (error) {
        setFormErrors(error.errors);
      }
    },
    [history, isEditing, store.movieStore]
  );

  return (
    <div>
      {store.movieStore.status === STATES.failed && (
        <p className="text-red-500" data-testid="general-error">
          {store.movieStore.errors.general}
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
            disabled={store.movieStore.status === STATES.loading}
          />
          {formErrors && (
            <p className="text-xs text-red-500" data-testid="title-error">
              {formErrors.title}
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
            disabled={store.movieStore.status === STATES.loading}
          />
          {formErrors && (
            <p className="text-xs text-red-500" data-testid="release-error">
              {formErrors.release}
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
            disabled={store.movieStore.status === STATES.loading}
          ></textarea>
          {formErrors && (
            <p className="text-xs text-red-500" data-testid="synopsis-error">
              {formErrors.synopsis}
            </p>
          )}
        </div>
        <button
          className="inline-block px-5 py-3 bg-green-500 rounded text-white font-semibold text-right"
          type="submit"
          data-testid="submit"
          disabled={store.movieStore.status === STATES.loading}
        >
          {store.movieStore.status === STATES.loading
            ? "Submitting..."
            : "Submit"}
        </button>
      </form>
    </div>
  );
}
