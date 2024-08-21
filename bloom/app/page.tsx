import React from 'react';
import { signIn, signOut } from "../auth";

export default function App() {
  return (
    <>
      <form action={async () => {
        "use server"
        await signIn("google", {redirectTo: "/dashboard"});
      }}>
        <button type="submit">
          Sign in.
        </button>
      </form>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
)
  ;
};

