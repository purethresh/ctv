"use client"
import { Authenticator } from "@aws-amplify/ui-react";
import { Hub } from "aws-amplify/utils";
import { useRouter } from 'next/navigation';
import { LinkPageData } from "@/app/db/LinkPageData";
import { useState } from "react";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  let [pageData, setPageData] = useState<LinkPageData>(new LinkPageData());

  const checkMemberAndLink = async () => {
    // Load the member info
    const pData = pageData;;
    await pData.loadMemberInfo();
    const isLinked = pData.uInfo.isLinkedMember();

    // If the member is linked, then we need to redirect to the main page
    if (isLinked) {
      router.replace('/');
    }
    else {
      // Otherwise, we need to show the link page
      router.replace('/guest/link');
    }
  }
  
  Hub.listen('auth', ({payload}) => {
    switch (payload.event) {
      case 'signedIn':
        checkMemberAndLink();
        break;
      default:
        // Don't do anything
    }
  });
  

  return (
      <Authenticator/>
  );


}