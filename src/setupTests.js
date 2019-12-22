import '@testing-library/jest-dom/extend-expect';

import { createServer } from '../src/mirage/index';

let server;

beforeEach(() => {
  server = createServer({ environment: 'test' });
});

afterEach(() => {
  server.shutdown();
});

global.server = server;
