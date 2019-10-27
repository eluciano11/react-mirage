import React from 'react';

import MovieForm from '../../components/forms/movie';
import { useMovie } from '../../hooks/index';

function EditMovie() {
  const { movie, loading } = useMovie();

  console.log({ movie, loading });

  if (loading) {
    return <div>Loading...</div>;
  }

  return <MovieForm {...movie} isEditing={true} />;
}

export default EditMovie;
