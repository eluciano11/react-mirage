import React, { useCallback, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';

function MovieForm(props) {
  const title = useRef(props.title || null);
  const release = useRef(props.release || null);
  const synopsis = useRef(props.synopsis || null);
  const { id } = useParams();
  const history = useHistory();

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      const data = {
        title: title.current.value,
        release: release.current.value,
        synopsis: synopsis.current.value
      };
      const endpoint = props.isEditing ? `/movies/${id}/` : '/movies';
      const method = props.isEditing ? 'PATCH' : 'POST';

      await fetch(endpoint, {
        method,
        body: JSON.stringify({ data: { type: 'movies', attributes: data } })
      });

      history.push('/');
    },
    [history, id, props.isEditing]
  );

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input ref={title} id="title" type="text" defaultValue={props.title} />
      <label htmlFor="release">Release date</label>
      <input
        ref={release}
        id="release"
        type="text"
        defaultValue={props.release}
      />
      <label htmlFor="synopsis">Synopsis</label>
      <textarea
        ref={synopsis}
        name="synopsis"
        id="synopsis"
        cols="30"
        rows="10"
        defaultValue={props.synopsis}
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
}

export default MovieForm;
