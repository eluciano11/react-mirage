import { createServer } from '../../src/mirage/index';

let server = null;

describe('Add movie', () => {
  beforeEach(() => {
    server = createServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should be able to access the add movie route through the index page', () => {
    server.createList('movie', 10);

    // Visit the url
    cy.visit('/');

    // Find the add movie button and click it.
    cy.get('[data-testid="add-movie"]').click();

    // Assert that we can access the add movie page.
    cy.url().should('eq', 'http://localhost:3000/add');
  });

  it('should be able to access the add movie route directly', () => {
    cy.visit('/add');

    cy.url().should('eq', 'http://localhost:3000/add');
  });

  it('should be able to add a movie', () => {
    // Go directly to the add movie route.
    cy.visit('/add');

    // Fill in the information for a new movie.
    cy.get('[data-testid="title"]').type('Star Wars');
    cy.get('[data-testid="release"]').type('1999');
    cy.get('[data-testid="synopsis"]').type('This was the coolest movie ever!');

    // Submit the form.
    cy.get('[data-testid="submit"]').click();

    // Verify that we transitioned back to the movie list and find the movie.
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('Star Wars 1999');
  });
});
