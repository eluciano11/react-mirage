import React from 'react';

import { wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Response } from '@miragejs/server';

import { render } from '../../../../tests/utils';
import Movie from '../movie';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams() {
    return { id: 1 };
  }
}));

describe('Movie details', function() {
  it('should render the movie details when the load is successful', async () => {
    const title = 'The testing movie';
    const release = '2019';
    const synopsis = 'This is just a test';

    server.create('movie', {
      title,
      release,
      synopsis
    });

    const { getByTestId } = render(<Movie />);

    await wait(() => expect(getByTestId('movie-details')).toBeInTheDocument());

    expect(getByTestId('title')).toHaveTextContent(title);
    expect(getByTestId('release')).toHaveTextContent(release);
    expect(getByTestId('synopsis')).toHaveTextContent(synopsis);
  });

  it('should handle errors when fetching the movie details', async () => {
    server.get('/movies/1', () => {
      return new Response(500, {}, {});
    });

    const { getByTestId } = render(<Movie />);

    await wait(() =>
      expect(getByTestId('movie-loading-error')).toBeInTheDocument()
    );
  });

  it('should delete the movie successfully', async () => {
    server.create('movie');

    const { getByTestId } = render(<Movie />);

    await wait(() => expect(getByTestId('delete')).toBeInTheDocument());
    expect(getByTestId('delete')).toBeEnabled();

    userEvent.click(getByTestId('delete'));

    // Make sure that the form made a request.
    const requests = server.pretender.handledRequests;

    expect(requests).toHaveLength(2);

    const getMovieRequest = requests[0];
    const deleteMovieRequest = requests[1];

    expect(getMovieRequest.method).toEqual('GET');
    expect(getMovieRequest.status).toBe(200);

    expect(deleteMovieRequest.method).toEqual('DELETE');
    expect(deleteMovieRequest.status).toBe(0);
  });

  it('should handle permissions error when deleting a movie', async () => {
    server.create('movie');

    let error = 'Not enough permissions to complete task.';
    server.delete('/movies/1', () => {
      return new Response(403, {}, { errors: { general: error } });
    });

    const { getByTestId } = render(<Movie />);

    await wait(() => expect(getByTestId('delete')).toBeInTheDocument());
    expect(getByTestId('delete')).toBeEnabled();

    userEvent.click(getByTestId('delete'));

    // Should display general error message
    await wait(() => expect(getByTestId('general-error')).toBeInTheDocument());

    expect(getByTestId('general-error')).toHaveTextContent(error);

    // Make sure that the form made a request.
    const requests = server.pretender.handledRequests;

    expect(requests).toHaveLength(2);

    const getMovieRequest = requests[0];
    const deleteMovieRequest = requests[1];

    // Should load the movie correctly.
    expect(getMovieRequest.method).toEqual('GET');
    expect(getMovieRequest.status).toBe(200);

    // Should fail when you try to delete the movie.
    expect(deleteMovieRequest.method).toEqual('DELETE');
    expect(deleteMovieRequest.status).toBe(403);
  });

  it('should handle unexpected errors when deleting a movie', async () => {
    server.create('movie');

    server.delete('/movies/1', () => {
      return new Response(500, {}, {});
    });

    const { getByTestId } = render(<Movie />);

    await wait(() => expect(getByTestId('delete')).toBeInTheDocument());
    expect(getByTestId('delete')).toBeEnabled();

    userEvent.click(getByTestId('delete'));

    // Should display general error message
    await wait(() => expect(getByTestId('general-error')).toBeInTheDocument());

    // Make sure that the form made a request.
    const requests = server.pretender.handledRequests;

    expect(requests).toHaveLength(2);

    const getMovieRequest = requests[0];
    const deleteMovieRequest = requests[1];

    // Should load the movie correctly.
    expect(getMovieRequest.method).toEqual('GET');
    expect(getMovieRequest.status).toBe(200);

    // Should fail when you try to delete the movie.
    expect(deleteMovieRequest.method).toEqual('DELETE');
    expect(deleteMovieRequest.status).toBe(500);
  });
});
