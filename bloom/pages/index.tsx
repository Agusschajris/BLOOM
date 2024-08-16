"use client";
import React from 'react';
import { signIn } from "next-auth/react";

const App = () => {
  return (
    <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
      Sign in.
    </button>
  );
};

export default App;
