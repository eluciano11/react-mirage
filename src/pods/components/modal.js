import React from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, isOpen }) {
  if (isOpen) {
    return createPortal(
      <div data-testid="modal">{children}</div>,
      document.body
    );
  }

  return null;
}
