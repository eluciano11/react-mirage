import React from 'react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center loader__container">
      <div className="loader" />
      <p>Loading...</p>
    </div>
  );
}
