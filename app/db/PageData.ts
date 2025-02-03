"use client";

import UserInfo from "../lib/UserInfo";
import { fetchUserAttributes } from "aws-amplify/auth";
import { APIHandler, API_CALLS } from "../lib/APIHandler";
import ChurchLabels from "../lib/ChurchLabels";
import { LabelInfo } from "../lib/LabelInfo";
import { MinMemberInfo } from "../lib/MinMemberInfo";


export class PageData {
    api:APIHandler;
    uInfo:UserInfo;
    churchLabels:ChurchLabels;
    memberList:MinMemberInfo[];

    constructor() {
        this.uInfo = new UserInfo();
        this.api = new APIHandler();
        this.churchLabels = new ChurchLabels();
        this.memberList = [];
    }

    signOut() {
      this.uInfo.setToNotAuthenticated();
    }

    clearCache() {
      this.api.resetCache();
    }

    // ----------------------------------------------
    // User / Member Info
    // ----------------------------------------------

    async loadMemberInfo() {
      // Load the user info
      try {
        let aInfo = await fetchUserAttributes();
        if (aInfo && aInfo.sub) {
          // Load the member info by sub
          const res = await this.api.getData(API_CALLS.member, { sub: aInfo.sub });
          const data = await res.json();
          // If there is data, and it isn't an error
          if (data && data.error === undefined) {
            this.uInfo.setMemberInfo(data);
          }
          else {
            // Make sure sub is set
            this.uInfo.sub = aInfo.sub;
          }
        }
      }
      catch(e) {
        this.uInfo.setToNotAuthenticated();
      }
    }

    async loadAdminInfo() {
      // Get the root id
      if (this.churchLabels.labelRoot) {
        // Get the root id
        const rootId = this.churchLabels.labelRoot.label_id;

        // Load the admin info
        await this.loadOwnersForLabel(rootId);
      }      
    }

    // ----------------------------------------------
    // Label Info
    // ----------------------------------------------


    async loadChurchLabels(cLabels:ChurchLabels | undefined = undefined) {
      const res = await this.api.getData(API_CALLS.labels, {church_id: this.uInfo.church_id});
      const data = await res.json();

      // Set the labels
      if (cLabels) {
        cLabels.setAllLabels(data);
      }
      else {
        this.churchLabels.setAllLabels(data);
      }
    }    

    async loadScheduledLabels(serviceId:string, cLabels:ChurchLabels | undefined = undefined) {
      const lbls = cLabels ? cLabels : this.churchLabels;

      // If no service id, then return
      if (serviceId.length <= 0) {
        lbls.setScheduledLabels([]);
        return;
      }

      // Get the scheduled labels for a specific service
      const api = new APIHandler();
      const res = await api.getData(API_CALLS.labelScheduled, {service_id: serviceId});
      const data = await res.json();

      lbls.setScheduledLabels(data);
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

    async loadAllOwners() {
        const res = await this.api.getData(API_CALLS.labelMember, {owner_id: 'true'});
        const data = await res.json();

        this.churchLabels.setOwnersForLabel(data);
    }

    async loadMembersForLabel(labelId:string) {
        // Get the scheduled labels for a specific service
        const api = new APIHandler();
        const res = await api.getData(API_CALLS.labelMember, {label_id: labelId});
        const data = await res.json();

        this.churchLabels.setMemberLabels(data);
    }

    // ----------------------------------------------
    // Member List
    // ----------------------------------------------
    async loadAllMembers() {
      const params = { church_id: this.uInfo.church_id, useFilter:"false"};

      const result = await this.api.getData(API_CALLS.member, params);
      const rs = await result.json();

      this.updateMemberList(rs);
    }

    async loadMembersWithPhoneFilter(filter:string) {
      // If the filter is empty, use an empty list
      if (filter.length <= 0) {
        this.memberList = [];
        return;
      }

      // Get the members with the phone filter
      const params = { church_id: this.uInfo.church_id, useFilter:"true", phoneFilter:filter};
      const result = await this.api.getData(API_CALLS.member, params);
      const rs = await result.json();

      this.updateMemberList(rs);
    }

    private updateMemberList(data:any) {
      this.memberList = [];

      for(var i=0; i<data.length; i++) {
          this.memberList.push(new MinMemberInfo(data[i]));
      }

      // Sort the list
      this.memberList.sort((a, b) => {
          var result = a.first.localeCompare(b.first);
          if (result === 0) {
              result = a.last.localeCompare(b.last);
          }
          return result;
      });
    }

}