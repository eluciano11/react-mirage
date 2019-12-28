import React from 'react';

import { Loader } from '../components/index';
import { MovieForm } from './components/index';
import { useMovie } from './hooks/index';

function EditMovie() {
  const movie = useMovie();

  switch (movie.status) {
    case 'LOADING': {
      return (
        <div className="w-11/12 m-auto text-center">
          <Loader />
        </div>
      );
    }

    case 'FAILED': {
      return (
        <div className="w-11/12 m-auto">
          <p>
            Failed to load movie{' '}
            <span role="img" aria-label="sad">
              😥
            </span>
          </p>
        </div>
      );
    }

    case 'SUCCESS': {
      return (
        <div className="w-11/12 m-auto">
          <h3 className="text-2xl font-semibold mb-5">Edit movie</h3>
          <MovieForm {...movie.data} isEditing={true} />
        </div>
      );
    }

    default: {
      return null;
    }
  }
}

export default EditMovie;
