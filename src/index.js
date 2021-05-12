import React from "react";
import ReactDOM from "react-dom";
import { Server, Response } from "miragejs";

import AppView from "./App";
import "./styles/index.css";
import * as serviceWorker from "./serviceWorker";
import { createServer } from "./mirage/index.js";
import { RootStoreProvider } from "./context/root";

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
          // @ts-ignore
          return new Response(...(await window.handleFromCypress(request)));
        });
      });
    },
  });
}

ReactDOM.render(
  <RootStoreProvider>
    <AppView />
  </RootStoreProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
