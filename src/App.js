import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./store/index";

import Pods from "./pods/index";
import "./styles/main.css";

function App() {
  return (
    <div className="w-full">
      <ConnectedRouter history={history}>
        <div className="text-center">
          <h2 className="text-4xl py-2 mb-2 bg-green-500">
            <Link className="text-white" to="/">
              React Mirage
            </Link>{" "}
            🤗
          </h2>
        </div>
        <div className="max-w-6xl m-auto h-full">
          <Switch>
            <Route path="/" exact>
              <Pods.Movies />
            </Route>
            <Route path="/add" exact>
              <Pods.AddMovie />
            </Route>
            <Route path="/:id/edit" exact>
              <Pods.EditMovie />
            </Route>
            <Route path="/:id" exact>
              <Pods.Movie />
            </Route>
          </Switch>
        </div>
      </ConnectedRouter>
    </div>
  );
}

export default App;
