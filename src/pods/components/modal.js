import React from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, isOpen }) {
  if (isOpen) {
    return createPortal(
      <div
        className="fixed top-0 right-0 w-screen h-screen flex items-center justify-center modal__overlay"
        data-testid="modal"
      >
        <div className="bg-white rounded">{children}</div>
      </div>,
      document.body
    );
  }

  return null;
}
