import React, { useCallback, useRef, useState } from 'react';

import { useParams, useHistory } from 'react-router-dom';

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

function MovieForm({ title, release, synopsis, isEditing }) {
  const titleRef = useRef(title || null);
  const releaseRef = useRef(release || null);
  const synopsisRef = useRef(synopsis || null);
  const { id } = useParams();
  const history = useHistory();
  const [errors, setErrors] = useState(null);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

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
          history.push('/');
        } else {
          throw new NetworkError({ res, data });
        }
      } catch (error) {
        // Handle field validation errors.
        if (error.type === 'FormValidationError') {
          setErrors(error.errors);
        } else {
          // Unhandled exceptions.
          setErrors({
            general: 'Ops! Something when wrong, please try again.'
          });
        }
      }
    },
    [history, id, isEditing, setErrors]
  );

  return (
    <section>
      {errors && <p data-testid="general-error">{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            ref={titleRef}
            id="title"
            type="text"
            data-testid="title"
            defaultValue={title}
          />
          {errors && <p data-testid="title-error">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="release">Release date</label>
          <input
            ref={releaseRef}
            id="release"
            type="text"
            data-testid="release"
            defaultValue={release}
          />
          {errors && <p data-testid="release-error">{errors.release}</p>}
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
          ></textarea>
          {errors && <p data-testid="synopsis-error">{errors.synopsis}</p>}
        </div>
        <button type="submit" data-testid="submit">
          Submit
        </button>
      </form>
    </section>
  );
}

export default MovieForm;
