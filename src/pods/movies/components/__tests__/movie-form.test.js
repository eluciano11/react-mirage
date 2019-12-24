import React from 'react';

import userEvent from '@testing-library/user-event';
import { wait } from '@testing-library/react';
import { Response } from '@miragejs/server';

import MovieForm from '../movie-form';
import { render } from '../../../../../tests/utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams() {
    return { id: 1 };
  }
}));

describe('Movie form', () => {
  test('should display errors when all required fields are missing', () => {
    const { getByTestId } = render(<MovieForm />);

    // Submit empty form
    userEvent.click(getByTestId('submit'));

    // Verify the field errors.
    expect(getByTestId('title-error')).toBeInTheDocument();
    expect(getByTestId('release-error')).toBeInTheDocument();
    expect(getByTestId('synopsis-error')).toBeInTheDocument();
  });

  test('should display errors when partial fields are provided', async () => {
    const { getByTestId } = render(<MovieForm />);

    // Partially fill fields
    await userEvent.type(getByTestId('title'), 'Testing');
    await userEvent.type(getByTestId('release'), '2019');

    // Submit form
    userEvent.click(getByTestId('submit'));

    expect(getByTestId('synopsis-error')).toBeInTheDocument();
  });

  test('should handle network errors on submission', async () => {
    // Respond with error
    server.post('/movies', () => {
      return new Response(500, {}, {});
    });

    const { getByTestId } = render(<MovieForm />);

    // Fill fields
    await userEvent.type(getByTestId('title'), 'Testing');
    await userEvent.type(getByTestId('release'), '2019');
    await userEvent.type(getByTestId('synopsis'), 'This is a summary');

    // Submit form
    userEvent.click(getByTestId('submit'));

    let requests = server.pretender.handledRequests;

    expect(requests).toHaveLength(1);

    await wait(() => expect(getByTestId('general-error')).toBeInTheDocument());
  });

  test('should display field errors returned from backend validation', async function() {
    const titleError = 'This field is required.';
    const releaseError = "Release date can't be greater than the current year.";
    // Respond with error
    server.post('/movies', () => {
      return new Response(
        422,
        {},
        {
          errors: {
            title: titleError,
            release: releaseError
          }
        }
      );
    });

    const { getByTestId } = render(<MovieForm />);

    // Fill fields
    await userEvent.type(getByTestId('title'), ' ');
    await userEvent.type(getByTestId('release'), '2030');
    await userEvent.type(getByTestId('synopsis'), 'This is a summary');

    // Submit form
    userEvent.click(getByTestId('submit'));

    // Wait for errors to be displayed.
    await wait(() => expect(getByTestId('title-error')).toBeInTheDocument());

    expect(getByTestId('title-error')).toHaveTextContent(titleError);
    expect(getByTestId('release-error')).toHaveTextContent(releaseError);

    // Make sure that the form made a request.
    let requests = server.pretender.handledRequests;

    expect(requests).toHaveLength(1);
  });

  test('should render with provided fields', () => {
    const movie = {
      title: 'Testing',
      release: '2019',
      synopsis: 'This is a test.',
      isEditing: true
    };
    const { getByTestId } = render(<MovieForm {...movie} />);

    // Verify that the provided values were rendered.
    expect(getByTestId('title')).toHaveValue(movie.title);
    expect(getByTestId('release')).toHaveValue(movie.release);
    expect(getByTestId('synopsis')).toHaveValue(movie.synopsis);
  });

  test('should show error when trying to submit an incomplete form when editing', async () => {
    const movie = {
      title: 'Testing',
      release: '2019',
      synopsis: 'This is a test.',
      isEditing: true
    };
    const { getByTestId } = render(<MovieForm {...movie} />);

    // Verify that the provided values were rendered.
    expect(getByTestId('title')).toHaveValue(movie.title);
    expect(getByTestId('release')).toHaveValue(movie.release);
    expect(getByTestId('synopsis')).toHaveValue(movie.synopsis);

    // Change value to be empty.
    userEvent.type(getByTestId('title'), '');

    // Submit form
    userEvent.click(getByTestId('submit'));

    // Verify that the error was displayed.
    await wait(() => expect(getByTestId('title-error')).toBeInTheDocument());
  });

  test('should show errors when trying to submit an empty form', async () => {
    const movie = {
      title: 'Testing',
      release: '2019',
      synopsis: 'This is a test.',
      isEditing: true
    };
    const { getByTestId } = render(<MovieForm {...movie} />);

    // Verify that the provided values were rendered.
    expect(getByTestId('title')).toHaveValue(movie.title);
    expect(getByTestId('release')).toHaveValue(movie.release);
    expect(getByTestId('synopsis')).toHaveValue(movie.synopsis);

    // Change value to be empty.
    userEvent.type(getByTestId('title'), '');
    userEvent.type(getByTestId('release'), '');
    userEvent.type(getByTestId('synopsis'), '');

    // Submit form
    userEvent.click(getByTestId('submit'));

    // Verify that the error was displayed.
    await wait(() => {
      expect(getByTestId('title-error')).toBeInTheDocument();
      expect(getByTestId('release-error')).toBeInTheDocument();
      expect(getByTestId('synopsis-error')).toBeInTheDocument();
    });
  });

  test('should handle network errors on submission when editing', async () => {
    // Respond with error
    server.patch('/movies', () => {
      return new Response(500, {}, {});
    });

    const movie = {
      title: 'Testing',
      release: '2019',
      synopsis: 'This is a test.',
      isEditing: true
    };
    const { getByTestId } = render(<MovieForm {...movie} />);

    // Submit form
    userEvent.click(getByTestId('submit'));

    let requests = server.pretender.handledRequests;

    expect(requests).toHaveLength(1);

    await wait(() => expect(getByTestId('general-error')).toBeInTheDocument());
  });

  test('should display field errors returned from backend validation when editing a movie', async function() {
    const titleError = 'This field is required.';
    const releaseError = "Release date can't be greater than the current year.";
    // Respond with error
    server.patch('/movies/1', () => {
      return new Response(
        422,
        {},
        {
          errors: {
            title: titleError,
            release: releaseError
          }
        }
      );
    });

    const movie = {
      title: 'Testing',
      release: '2019',
      synopsis: 'This is a test.',
      isEditing: true
    };
    const { getByTestId } = render(<MovieForm {...movie} />);

    // Fill fields
    await userEvent.type(getByTestId('title'), ' ');
    await userEvent.type(getByTestId('release'), '2030');
    await userEvent.type(getByTestId('synopsis'), 'This is a summary');

    // Submit form
    userEvent.click(getByTestId('submit'));

    // Wait for errors to be displayed.
    await wait(() => expect(getByTestId('title-error')).toBeInTheDocument());

    expect(getByTestId('title-error')).toHaveTextContent(titleError);
    expect(getByTestId('release-error')).toHaveTextContent(releaseError);

    // Make sure that the form made a request.
    let requests = server.pretender.handledRequests;

    expect(requests).toHaveLength(1);
  });
});
