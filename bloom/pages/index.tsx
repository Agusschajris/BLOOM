"use client";
import React from 'react';
import { SignIn } from "../auth-actions";

const App = () => {
  return (
    <form action={() => {
      SignIn()
    }}>
    <button type="submit">
      Sign in.
    </button>
    </form>
  );
};

export default App;
