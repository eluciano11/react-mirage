import React from 'react';
import { waitForElement } from '@testing-library/react';

import { render } from '../../../../tests/utils';
import { createServer } from '../../../mirage/index';
import MovieList from '../index.js';

// Create a server. It will be empty on every test case.
let server;

beforeEach(() => {
  server = createServer({ environment: 'test' });
});

afterEach(() => {
  server.shutdown();
});

describe('Application tests', function() {
  it('should render with loading state', async () => {
    // Render app
    const { getByTestId } = render(<MovieList />);

    await waitForElement(() => getByTestId('loadingMovies'));

    expect(getByTestId('loadingMovies')).toBeTruthy();
  });

  it('should render list of movies when the server responds', async () => {
    server.createList('movie', 10);

    // Render list
    const { getByTestId, getAllByTestId } = render(<MovieList />);

    // Wait for lists to load
    await waitForElement(() => getByTestId('movieList'));

    expect(getAllByTestId('movie')).toHaveLength(10);
  });

  it("should render an empty view when there's no movies to show", async () => {
    // Render list
    const { getByTestId } = render(<MovieList />);

    // Wait for lists to load
    await waitForElement(() => getByTestId('emptyMovies'));

    expect(getByTestId('emptyMovies')).toBeTruthy();
  });
});
