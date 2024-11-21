"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import SNavbar from "./components/SNavbar";
import SChurchCalendar from "./components/SChurchCalendar";
import SLabelDay from "./components/SLabelDay";

Amplify.configure(outputs);

// TODO JLS HERE
// Create a Lib for getting user Info
// 
// Then call that here at the page level
// Pass the results into SNavbar, SChurchCalendar, and SLabelDay
//
// *
// * Then pass them into the SCalendar component.
// * Get called when selected date is changed
// * Pass that into SLabelDay
// * Implement SLabelDay

export default function App() {
  return (
    <main>
      <SNavbar />
      <SChurchCalendar />
      <SLabelDay />
    </main>
  )
}
