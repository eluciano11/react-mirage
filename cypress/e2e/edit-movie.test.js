import { createServer } from '../../src/mirage/index';

let server = null;

describe('Edit movie', () => {
  beforeEach(() => {
    server = createServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should display a movie detail when clicking on a movie', () => {
    // Create a movie.
    let movies = server.createList('movie', 5);
    let firstMovie = movies[0];

    // Visit movie.
    cy.visit('/');
    cy.get('[data-testid="movie"]')
      .first()
      .click();

    // Verify that the url changed.
    cy.url().should('eq', `http://localhost:3000/${firstMovie.id}`);
  });

  it('should display a movie detail when visiting a movie directly', () => {
    // Create a movie.
    let movie = server.create('movie', {
      title: 'Mirage The Movie',
      release: 2020,
      synopsis:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum iste molestias placeat labore, repellat, eius veritatis magni quibusdam voluptas, tempora itaque omnis iusto delectus amet magnam neque quam in iure.'
    });

    // Visit movie.
    cy.visit(`/${movie.id}`);

    // Assert that the url is correct.
    cy.url().should('eq', `http://localhost:3000/${movie.id}`);
  });

  it('should be able to edit a movie', () => {
    // Create a movie.
    let movie = server.create('movie', {
      title: 'Mirage The Movie',
      release: 2020,
      synopsis:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum iste molestias placeat labore, repellat, eius veritatis magni quibusdam voluptas, tempora itaque omnis iusto delectus amet magnam neque quam in iure.'
    });

    // Visit movie.
    cy.visit(`/${movie.id}`);
    cy.get('[data-testid="edit"]').click();

    cy.url().should('eq', `http://localhost:3000/${movie.id}/edit`);

    // Change text
    cy.get('[data-testid="title"]').type('{selectall}{backspace}Edited Movie');
    cy.get('[data-testid="release"]').type('{selectall}{backspace}2020');
    cy.get('[data-testid="synopsis"]').type(
      '{selectall}{backspace}This is the coolest edited movie!'
    );

    cy.get('[data-testid="submit"]').click();

    // Verify that the route changed and that the movie is present.
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('Edited Movie');
  });

  it('should be able to delete a movie', () => {
    // Create a movie.
    let movie = server.create('movie', {
      title: 'Mirage The Movie',
      release: 2020,
      synopsis:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum iste molestias placeat labore, repellat, eius veritatis magni quibusdam voluptas, tempora itaque omnis iusto delectus amet magnam neque quam in iure.'
    });

    // Visit movie.
    cy.get('[data-testid="movie"]')
      .first()
      .click();

    // Visit the movie details.
    cy.url().should('eq', `http://localhost:3000/${movie.id}`);

    // Delete the movie.
    cy.get('[data-testid="delete"]').click();
    cy.get('[data-testid="confirm"]').click();

    // Verify that the movie doesn't exist and check the url.
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('[data-testid="empty"]').should('exist');
  });
});
