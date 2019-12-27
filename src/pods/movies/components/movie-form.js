import React, { useCallback, useRef, useReducer } from 'react';

import { useParams, useHistory } from 'react-router-dom';

const GENERIC_ERROR = {
  general: 'Ops! Something went wrong, please try again!'
};

function FormValidationError({ errors }) {
  this.type = 'FormValidationError';
  this.errors = errors;
}

function NetworkError({ res, data }) {
  this.type = res.status === 422 ? 'FormValidationError' : 'UnhandledError';
  this.errors = data.errors;
}

function hasContent({ field }) {
  if (field && field != null) {
    return {
      isValid: true,
      cleanData: field,
      error: null
    };
  }

  return {
    isValid: false,
    cleanData: null,
    error: 'This field is required.'
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
            [current]: entry.error
          }
        };
      }

      return {
        ...prev,
        cleanData: {
          ...prev.cleanData,
          [current]: entry.cleanData
        }
      };
    },
    { cleanData: {}, errors: {} }
  );

  if (allFieldsValid) {
    return { cleanData: result.cleanData };
  }

  throw new FormValidationError({ errors: result.errors });
}

const STATES = {
  idle: 'IDLE',
  loading: 'LOADING',
  failed: 'FAILED',
  completed: 'COMPLETED'
};

const EVENTS = {
  submitted: 'SUBMITTED',
  resolved: 'RESOLVED',
  rejected: 'REJECTED'
};

const initialState = {
  status: STATES.idle,
  errors: null
};

function reducer(state = initialState, action) {
  switch (state.status) {
    case STATES.failed:
    case STATES.idle: {
      switch (action.type) {
        case EVENTS.submitted: {
          return Object.assign({}, state, {
            status: STATES.loading,
            errors: null
          });
        }

        default: {
          return state;
        }
      }
    }

    case STATES.loading: {
      switch (action.type) {
        case EVENTS.resolved: {
          return Object.assign({}, state, {
            status: STATES.completed,
            errors: null
          });
        }

        case EVENTS.rejected: {
          return Object.assign({}, state, {
            status: STATES.failed,
            errors: action.errors
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

function MovieForm({ title, release, synopsis, isEditing }) {
  const titleRef = useRef(title || null);
  const releaseRef = useRef(release || null);
  const synopsisRef = useRef(synopsis || null);
  const { id } = useParams();
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      dispatch({ type: EVENTS.submitted });

      try {
        const fields = {
          title: hasContent({ field: titleRef.current.value }),
          release: hasContent({ field: releaseRef.current.value }),
          synopsis: hasContent({ field: synopsisRef.current.value })
        };
        const { cleanData } = validateForm({ fields });
        const endpoint = isEditing ? `/movies/${id}/` : '/movies';
        const method = isEditing ? 'PATCH' : 'POST';

        const res = await fetch(endpoint, {
          method,
          body: JSON.stringify({
            data: { type: 'movies', attributes: cleanData }
          })
        });
        const data = await res.json();

        if (res.status >= 200 && res.status <= 299) {
          dispatch({ type: EVENTS.resolved });
          history.push('/');
        } else {
          throw new NetworkError({ res, data });
        }
      } catch (error) {
        const errors =
          error.type === 'FormValidationError' ? error.errors : GENERIC_ERROR;

        dispatch({ type: EVENTS.rejected, errors });
      }
    },
    [history, id, isEditing]
  );

  return (
    <section>
      {state.status === STATES.failed && (
        <p data-testid="general-error">{state.errors.general}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            ref={titleRef}
            id="title"
            type="text"
            data-testid="title"
            defaultValue={title}
            disabled={state.status === STATES.loading}
          />
          {state.status === STATES.failed && (
            <p data-testid="title-error">{state.errors.title}</p>
          )}
        </div>
        <div>
          <label htmlFor="release">Release date</label>
          <input
            ref={releaseRef}
            id="release"
            type="text"
            data-testid="release"
            defaultValue={release}
            disabled={state.status === STATES.loading}
          />
          {state.status === STATES.failed && (
            <p data-testid="release-error">{state.errors.release}</p>
          )}
        </div>
        <div>
          <label htmlFor="synopsis">Synopsis</label>
          <textarea
            ref={synopsisRef}
            name="synopsis"
            id="synopsis"
            cols="30"
            rows="10"
            data-testid="synopsis"
            defaultValue={synopsis}
            disabled={state.status === STATES.loading}
          ></textarea>
          {state.status === STATES.failed && (
            <p data-testid="synopsis-error">{state.errors.synopsis}</p>
          )}
        </div>
        <button
          type="submit"
          data-testid="submit"
          disabled={state.status === STATES.loading}
        >
          {state.status === STATES.loading ? 'Adding' : 'Add'}
        </button>
      </form>
    </section>
  );
}

export default MovieForm;
