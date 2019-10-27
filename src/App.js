import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Pods from './pods/index';
import { makeServer } from './mirage/index';
import './App.css';

makeServer();

function App() {
  return (
    <div>
      <Router>
        <h2>
          <Link to="/">React Mirage</Link>🤗
        </h2>
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
      </Router>
    </div>
  );
}

export default App;
