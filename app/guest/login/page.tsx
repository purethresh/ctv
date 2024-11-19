"use client"
import { Authenticator } from "@aws-amplify/ui-react";
import { Hub } from "aws-amplify/utils";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  Hub.listen('auth', ({payload}) => {
    switch (payload.event) {
      case 'signedIn':
        router.replace('/');
        break;
      default:
        // Don't do anything
    }
  });
  

  return (
      <Authenticator/>
  );


}