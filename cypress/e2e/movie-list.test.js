import { Response } from '@miragejs/server';

import { createServer } from '../../src/mirage/index';

let server = null;

describe('Movies list', () => {
  beforeEach(() => {
    server = createServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should show a list of 5 movies', () => {
    server.createList('movie', 5);

    cy.visit('/');

    cy.get('[data-testid="movie"]').should('have.length', 5);
  });

  it('should show empty view when no movies are found', () => {
    cy.visit('/');

    cy.get('[data-testid="empty"]').should('exist');
  });

  it('should show error view when we find an error', () => {
    server.get('/movies', () => {
      return new Response(500);
    });

    cy.visit('/');

    cy.get('[data-testid="error"]').should('exist');
  });
});
