"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    <>
      <p>Signed in as {session.user.email}</p>
      <button onClick={() => signOut()} className="p-2 bg-orange-500">
        Sign in
      </button>
    </>;
  }
  return (
    <>
      <p>Not signed in</p>
      <button className="p-2 bg-orange-500">Sign in</button>
    </>
  );
}
