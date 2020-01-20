// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import 'cypress-jest-adapter';

// Import commands.js using ES2015 syntax:
import './commands';

Cypress.on('window:before:load', win => {
  win.handleFromCypress = function(request) {
    return fetch(request.url, {
      method: request.method,
      body: request.requestBody
    }).then(async res => {
      const body =
        res.headers.map['content-type'] === 'application/json'
          ? await res.json()
          : '';

      return [res.status, res.headers, body];
    });
  };
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
