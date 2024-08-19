"use client";
import React from 'react';
import { signIn, providerMap } from "../auth";

const App = () => {
  return (
    <button onClick={() => signIn(providerMap[0].id, { callbackUrl: "/dashboard" })}>
      Sign in.
    </button>
  );
};

export default App;
