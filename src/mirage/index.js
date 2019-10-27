import { Server, Model } from '@miragejs/server';

import Factories from './factories/index';

const MirageServer = new Server({
  models: {
    movie: Model
  },
  factories: Factories,
  // Seeds are not loaded on your test env to give you the
  // opportunity to define the test env yourself for each test.
  seeds(server) {
    server.createList('movie', 10);
  },
  // Serializers
  // The application serializer can be customized. By default
  // Mirage ships with support for ActiveModel, JSONAPISerializer, RestSerializer and or creating your own custom serializer.
  // By default mirage uses the RestSerializer.
  // Mirage lets you customize your serializer at the application level
  // and at the model level.
  // The more conventional and consistent your production API is the easier
  // it is to write it in mirage.
  routes() {
    // With RestApi
    // Shorthands will only work if you're using JSON:API
    this.get('/movies');
    this.post('/movies');
    this.get('/movies/:id');
    this.delete('/movies/:id');
    this.patch('/movies/:id');

    // Customizing the request handlers.
    // this.get('/movies', schema => schema.db.movies);
    // this.post('/movies', (schema, request) => {
    //   const data = JSON.parse(request.requestBody);

    //   console.log(schema.movies);

    //   return schema.movies.create(data);
    // });
    // this.get('/movies/:id', (schema, request) => {
    //   const { id } = request.params;

    //   return schema.db.movies.find(id);
    // });
  }
});

export default MirageServer;
