"use client";
import React from 'react';
import { signIn } from "../auth";

const App = () => {
  return (
    <button
      onClick={() => signIn("google", { redirectTo: "/dashboard" })}
    >Sign in.</button>
  );
};

export default App;
