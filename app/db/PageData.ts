"use client";

import UserInfo from "../lib/UserInfo";
import { fetchUserAttributes } from "aws-amplify/auth";
import { getMemberInfoBySub, getChurchForMember } from "./DBCalls";
import { APIHandler, API_CALLS } from "../lib/APIHanlder";
import ChurchLabels from "../lib/ChurchLabels";
import { LabelInfo } from "../lib/LabelInfo";


export class PageData {
    api:APIHandler;
    uInfo:UserInfo;
    churchLabels:ChurchLabels;

    constructor() {
        this.uInfo = new UserInfo();
        this.api = new APIHandler();
        this.churchLabels = new ChurchLabels();
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

    async loadChurchLabels() {
      const res = await this.api.getData(API_CALLS.labels, {church_id: this.uInfo.church_id});
      const data = await res.json();

      // Set the labels
      this.churchLabels.setAllLabels(data);
    }


    async loadScheduledLabels(serviceId:string) {
      // If no service id, then return
      if (serviceId.length <= 0) {
        this.churchLabels.setScheduledLabels([]);
        return;
      }

      // Get the scheduled labels for a specific service
      const api = new APIHandler();
      const res = await api.getData(API_CALLS.labelScheduled, {service_id: serviceId});
      const data = await res.json();

      this.churchLabels.setScheduledLabels(data);
    }

    async loadMemberLabels(memberId:string) {
        // Get the scheduled labels for a specific service
        const api = new APIHandler();
        const res = await api.getData(API_CALLS.labelMember, {member_id: memberId});
        const data = await res.json();

        this.churchLabels.setMemberLabels(data);
    }

    async loadMembersForScheduledLabels() {
        // Create a list of all the scheduled labels
        var scheduledLabels:LabelInfo[] = [];
        this.churchLabels.labelMap.forEach((value:any, key:string) => {
            if (value.forSchedule) {
                scheduledLabels.push(value);
            }
        });

        // Now loop through the scheduled labels and get the members
        for(var i=0; i<scheduledLabels.length; i++) {
            const lbl = scheduledLabels[i];
            await this.loadMembersForLabel(lbl.label_id);
        }
    }

    async loadOwnersForLabel(labelId:string) {
        // Get the scheduled labels for a specific service
        const res = await this.api.getData(API_CALLS.labelMember, {label_id: labelId});
        const data = await res.json();

        this.churchLabels.setOwnersForLabel(data);
    }     

    private async loadMembersForLabel(labelId:string) {
        // Get the scheduled labels for a specific service
        const api = new APIHandler();
        const res = await api.getData(API_CALLS.labelMember, {label_id: labelId});
        const data = await res.json();

        this.churchLabels.setMemberLabels(data);
    }


}