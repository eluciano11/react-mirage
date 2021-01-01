import React from "react";
import ReactDOM from "react-dom";
import { Server, Response } from "@miragejs/server";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import App from "./App";
import "./styles/index.css";
import * as serviceWorker from "./serviceWorker";
import { createServer } from "./mirage/index";
import store, { history } from "./store/index";

// For development
if (process.env.NODE_ENV === "development" && !window.Cypress) {
  createServer();
}

// For cypress e2e.
if (window.Cypress) {
  // mirage cypress server
  new Server({
    environment: "test",
    routes() {
      let methods = ["get", "put", "patch", "post", "delete"];
      methods.forEach((method) => {
        this[method]("/*", async (schema, request) => {
          return new Response(...(await window.handleFromCypress(request)));
        });
      });
    },
  });
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
