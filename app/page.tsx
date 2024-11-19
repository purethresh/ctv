"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import SNavbar from "./components/SNavbar";
import SCalendar from "./components/SCalendar";
import SLabelDay from "./components/SLabelDay";

Amplify.configure(outputs);

// TODO JLS, Do Calendar next

export default function App() {
  return (
    <main>
      <SNavbar />
      <SCalendar />
      <SLabelDay />
    </main>
  )
}
