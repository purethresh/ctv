"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

export default function App() {
  const { signOut } = useAuthenticator();

  return (
    <main>
      Hello
      <br />
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
