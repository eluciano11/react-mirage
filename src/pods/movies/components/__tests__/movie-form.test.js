import React from 'react';

import userEvent from '@testing-library/user-event';
import { wait } from '@testing-library/react';
import { Response } from '@miragejs/server';

import MovieForm from '../movie-form';
import { render } from '../../../../../tests/utils';

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

    await wait(() => getByTestId('general-error'));
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
});
