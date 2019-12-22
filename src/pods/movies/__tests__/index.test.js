import React from 'react';

import { wait, act } from '@testing-library/react';
import { Response } from '@miragejs/server';

import { render } from '../../../../tests/utils';
import MovieList from '../index.js';

describe('Movie list', function() {
  it('should render with loading state', async () => {
    let getByTestId = null;

    act(() => {
      // Render app
      const result = render(<MovieList />);

      getByTestId = result.getByTestId;
    });

    // Wait for loading state to be shown.
    await wait(() => expect(getByTestId('loading')).toBeInTheDocument());
  });

  it("should render an empty view when there's no movies to show", async () => {
    // Render list
    const { getByTestId } = render(<MovieList />);

    // Wait for empty view to be displayed.
    // The empty view will be displayed because our mirage server doesn't have anything in its db.
    await wait(() => expect(getByTestId('empty')).toBeInTheDocument());
  });

  it('should render list of movies when the server responds', async () => {
    // Create a list of 10 movies and store it in the server's db.
    server.createList('movie', 10);

    // Render list
    const { getByTestId, getAllByTestId } = render(<MovieList />);

    // Wait for lists to load
    await wait(() => expect(getByTestId('list')).toBeInTheDocument());

    // Make sure we rendered all of the items.
    expect(getAllByTestId('movie')).toHaveLength(10);
  });

  it('should render error view when server returns a 500', async () => {
    // Intercept the request and respond with an error.
    server.get('/movies', () => {
      return new Response(500, {}, {});
    });

    const { getByTestId } = render(<MovieList />);

    // Wait for error to be handled.
    await wait(() => expect(getByTestId('error')).toBeInTheDocument());
  });
});
