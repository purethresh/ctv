"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { LoginInfo } from "./lib/login/LoginInfo";
import { useRouter } from 'next/navigation'
import SNavbar from "./components/SNavbar";
import SCalendar from "./components/SCalendar";
import SLabelDay from "./components/SLabelDay";

Amplify.configure(outputs);

export default function App() {
  const router = useRouter();
  const lInfo = new LoginInfo();
  lInfo.loadFromCookie();

  // If not logged in, redirect to login page
  if (lInfo.loginType === "none") {
    router.push("/guest/login");    
  }

  return (
    <main>
      <SNavbar />
      <SCalendar />
      <SLabelDay />
    </main>
  );
}
