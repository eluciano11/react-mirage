import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";

import { Loader } from "../components/index";
import { MovieForm } from "./components/index";
import { useRootStore } from "../../context/root";

const EditMovie = observer(() => {
  const store = useRootStore();
  const { id } = useParams();

  useEffect(() => {
    store.movieStore.fetchMovie(id);
  }, [id]);

  switch (store.movieStore.status) {
    case "LOADING": {
      return (
        <div className="w-11/12 m-auto text-center">
          <Loader />
        </div>
      );
    }

    case "FAILED": {
      return (
        <div className="w-11/12 m-auto">
          <p>
            Failed to load movie{" "}
            <span role="img" aria-label="sad">
              😥
            </span>
          </p>
        </div>
      );
    }

    case "SUCCESS": {
      return (
        <div className="w-11/12 m-auto">
          <h3 className="text-2xl font-semibold mb-5">Edit movie</h3>
          <MovieForm {...store.movieStore.currentMovie} isEditing={true} />
        </div>
      );
    }

    default: {
      return null;
    }
  }
});

export default EditMovie;
