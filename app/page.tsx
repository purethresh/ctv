"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { LoginInfo } from "./lib/login/LoginInfo";


Amplify.configure(outputs);

export default function App() {
  const lInfo = new LoginInfo();
  lInfo.loadFromCookie();

  // TODO JLS If lInfo.loginType is none, redirect to login page

  // Otherwise, show main page (calendar for a specific person)


  // TODO JLS
  // * Get cookie to see if user is logged in our guest
  // * If not logged in / guest, redirect to login page
  // * If Logged in, show main page (Calendar, Labels for each day)
  // * Create User / Church selector
  // * Create App Bar with name of church, and logout / switch user button
  // * Create Calendar component (place holder for now)
  // * Create component to show labels for selected day (place holder for now)


  return (
    <main>
      Main Page
    </main>
  );
}
