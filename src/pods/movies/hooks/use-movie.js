import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function useMovie() {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const getMovie = async () => {
      const res = await fetch(`/movies/${id}`);
      const { movie } = await res.json();

      setLoading(false);
      setMovie(movie);
    };

    getMovie();
  }, [id]);

  return { loading, movie };
}

export default useMovie;
