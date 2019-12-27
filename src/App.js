import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Pods from './pods/index';
import { createServer } from './mirage/index';
import './App.css';

createServer();

function App() {
  return (
    <div className="w-full">
      <Router>
        <div className="text-center">
          <h2 className="text-4xl py-2 mb-2 bg-green-500">
            <Link className="text-white" to="/">
              React Mirage
            </Link>{' '}
            🤗
          </h2>
        </div>
        <div className="max-w-6xl m-auto">
          <Switch>
            <Route path="/" exact>
              <Pods.Movies />
            </Route>
            <Route path="/add">
              <Pods.AddMovie />
            </Route>
            <Route path="/:id/edit">
              <Pods.EditMovie />
            </Route>

            <Route path="/:id">
              <Pods.Movie />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
