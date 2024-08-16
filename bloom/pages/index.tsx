import React from 'react';
import { signIn } from "../auth";

const App: React.FC = () => {
  const handleSignIn = async () => {
    "use server"
    await signIn("google", { redirectTo: "/dashboard" })
  }

  return <button onClick={handleSignIn}>Sign In</button>;
};

export default App;
