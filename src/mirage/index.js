import { Server, Model } from '@miragejs/server';

import Factories from './factories/index';

export function makeServer({ environment = 'development' } = {}) {
  return new Server({
    environment,

    models: {
      movie: Model
    },

    factories: Factories,

    seeds(server) {
      server.createList('movie', 10);
    },

    routes() {
      this.get('/movies');
      this.post('/movies');
      this.get('/movies/:id');
      this.delete('/movies/:id');
      this.patch('/movies/:id');
    }
  });
}
