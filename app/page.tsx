"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

export default function App() {

  // TODO JLS
  // * Get cookie to see if user is logged in our guest
  // * If not logged in / guest, redirect to login page
  // * If Logged in, show main page (Callander, Labels for each day)
  // * Create User / Church selector
  // * Create App Bar with name of church, and logout / switch user button
  // * Create Calendar component
  // * Create component to show labels for selected day

  return (
    <main>
      Main Page
    </main>
  );
}
