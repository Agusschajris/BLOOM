/*
"use client";
import { signIn } from "next-auth/react"
 
export default function App() {
  return <button onClick={() => signIn()}>Sign In</button>
}
*/

// server
import React from 'react';
import { providerMap, signIn } from "../auth";

export default function App() {
  return (
    <form action={async () => {
        "use server"
        await signIn();//(providerMap[0].id, {redirectTo: "/dashboard"})
      }}>
    <button type="submit">
      Sign in.
    </button>
    </form>
  );
};

