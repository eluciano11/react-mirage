import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { render as rtlRender } from '@testing-library/react';

function Wrapper({ children }) {
  return <Router>{children}</Router>;
}

function render(ui, options) {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export { render };
