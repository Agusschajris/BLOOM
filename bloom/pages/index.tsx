"use server"
import React from 'react';
import { signIn } from "../auth";

const App = () => {
  return 
  <form
    action={async () => {
      await signIn("google", { redirectTo: "/dashboard" })
  }}>
    <button type="submit">Sign in</button>
  </form>;
};

export default App;
