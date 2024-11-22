"use client"

import React from "react";
import { Amplify } from "aws-amplify";
import "../app.css";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import UserInfo from "../lib/UserInfo";
import SNavbar from "../components/SNavbar";
import { useRouter } from "next/router";

Amplify.configure(outputs);

export default function ScheduleLayout({children}: {children: React.ReactNode;}) {
    let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
    
    useEffect(() => {
        const getUserInfo = async() => {
            const uInfo = new UserInfo();

            await uInfo.loadMemberInfo();
            setUserInfo(uInfo);
        }    

        getUserInfo();
    }, []);  

    const onSignout = () => {
        // Reset the user info
        setUserInfo(new UserInfo());        
    }    

    return (
        <Authenticator>
            <SNavbar userInfo={userInfo} onSignout={onSignout} />
            {children}
        </Authenticator>
    );
}