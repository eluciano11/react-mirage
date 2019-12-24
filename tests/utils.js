import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { render as rtlRender } from '@testing-library/react';

function render(ui, options) {
  function Wrapper({ children }) {
    return <Router>{children}</Router>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export { render };
