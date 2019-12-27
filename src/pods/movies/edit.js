import React from 'react';

import { MovieForm } from './components/index';
import { useMovie } from './hooks/index';

function EditMovie() {
  const movie = useMovie();

  switch (movie.state) {
    case 'LOADING': {
      return <div>Loading...</div>;
    }

    case 'FAILED': {
      return <div>Failed to load movie</div>;
    }

    case 'SUCCESS': {
      return <MovieForm {...movie.data} isEditing={true} />;
    }

    default: {
      return null;
    }
  }
}

export default EditMovie;
