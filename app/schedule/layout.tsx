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
import { PageData } from "../db/PageData";

Amplify.configure(outputs);

export default function ScheduleLayout({children}: {children: React.ReactNode;}) {
    let [pageData, setPageData] = useState<PageData>(new PageData());
    let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
    
    useEffect(() => {
        const getUserInfo = async() => {
            const pData = pageData;
            await pData.loadMemberInfo();

            setUserInfo(pData.uInfo);
            setPageData(pData);
        }    

        getUserInfo();
    }, []);  

    const onSignout = () => {
        const pData = pageData;
        pData.uInfo.setToNotAuthenticated();

        setUserInfo(pData.uInfo);
        setPageData(pData);
    }    

    return (
        <Authenticator>
            <SNavbar userInfo={userInfo} onSignout={onSignout} />
            <br />
            {children}
        </Authenticator>
    );
}