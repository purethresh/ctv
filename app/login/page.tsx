"use client";
import { Authenticator } from "@aws-amplify/ui-react";
// import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  return (
    <Authenticator></Authenticator>
  );
}
