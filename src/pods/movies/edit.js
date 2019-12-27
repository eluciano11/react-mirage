import React from 'react';

import { MovieForm } from './components/index';
import { useMovie } from './hooks/index';

function EditMovie() {
  const { movie, loading } = useMovie();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <MovieForm {...movie} isEditing={true} />;
}

export default EditMovie;
