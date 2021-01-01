import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { MOVIE_EVENTS } from "../redux/constants";

function useMovie() {
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return {
      ...state.movie,
    };
  });
  const { id } = useParams();

  useEffect(() => {
    dispatch({ type: MOVIE_EVENTS.fetch, id });
  }, [id, dispatch]);

  return state;
}

export default useMovie;
