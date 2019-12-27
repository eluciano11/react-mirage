import React from 'react';
import { MovieForm } from './components/index';

export default function Add() {
  return (
    <section className="w-11/12 m-auto">
      <h3 className="text-2xl font-semibold mb-5">Add your movie</h3>
      <MovieForm isEditing={false} />
    </section>
  );
}
