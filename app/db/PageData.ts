"use client";

import UserInfo from "../lib/UserInfo";
import { fetchUserAttributes } from "aws-amplify/auth";
import { getMemberInfoBySub, getChurchForMember } from "./DBCalls";
import { APIHandler, API_CALLS } from "../lib/APIHanlder";


export class PageData {
    api:APIHandler;
    uInfo:UserInfo;

    constructor() {
        this.uInfo = new UserInfo();
        this.api = new APIHandler();
    }

    signOut() {
      this.uInfo.setToNotAuthenticated();
    }

    async loadMemberInfo() {
      // Load the user info
      try {
        let aInfo = await fetchUserAttributes();
        if (aInfo && aInfo.sub) {
          // Load the member info by sub
          const res = await this.api.getData(API_CALLS.member, { sub: aInfo.sub });
          const data = await res.json();
          if (data) {
            this.uInfo.setMemberInfo(data);
          }        
        }
      }
      catch(e) {
        this.uInfo.setToNotAuthenticated();
      }
    }


}