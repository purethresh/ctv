"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

export default function App() {
  // TODO JLS
  // Add Material to project
  // https://mui.com/material-ui/

  // For calandar
  // https://mui.com/x/react-date-pickers/date-calendar/

  return (
    <div>hi</div>
  );
}
