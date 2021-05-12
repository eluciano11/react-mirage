import { Server, Model } from "miragejs";

import Factories from "./factories/index";

export function createServer({
  environment = "development",
  trackRequests = false,
} = {}) {
  return new Server({
    environment,

    trackRequests,

    models: {
      movie: Model,
    },

    factories: Factories,

    seeds(server) {
      server.createList("movie", 10);
    },

    routes() {
      this.get("/movies");
      this.post("/movies");
      this.get("/movies/:id");
      this.delete("/movies/:id");
      this.patch("/movies/:id");
    },
  });
}
