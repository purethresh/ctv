import { PageData } from './PageData';
import { API_CALLS } from '../lib/APIHandler';
import { ServiceInfo } from '../lib/ServiceInfo';
import { ChurchSchedule } from '../lib/ChurchSchedule';
import { ScheduleInfo } from '../lib/ScheduleInfo';


export class SchedulePageData extends PageData {
    scheduleList:ChurchSchedule[];      // List of ChurchSchedule for the month
    monthlyDays:number[];               // List of days that have a schedule for the month
    currentSchedule:ChurchSchedule[];   // List of ChurchSchedule for the current day
    // serviceList:ServiceInfo[];
    // schedule:ChurchSchedule;

    constructor() {
        super();
        this.scheduleList = [];
        this.monthlyDays = [];
        this.currentSchedule = [];
        // this.serviceList = [];
        // this.schedule = new ChurchSchedule('');
    }

    async loadMemberInfo() {
        await super.loadMemberInfo();
        // this.schedule = new ChurchSchedule(this.uInfo.church_id);
    }

    selectServiceForDay(dt:Date) {
        this.currentSchedule = [];
        const day = dt.getDate();
        for (var i=0; i<this.scheduleList.length; i++) {
            const sInfo = this.scheduleList[i];
            if (sInfo.serviceInfo.serviceAsDate().getDate() == day) {
                this.currentSchedule.push(sInfo);
            }
        }
    }

    async loadServiceForDay(yr:number, mo:number, dy:number) {
        // // If no church ID, then return
        // if (this.uInfo.church_id == undefined) return;

        // // Get list of services
        // const res = await this.api.getData(API_CALLS.services, { church_id: this.uInfo.church_id, year: yr, month: mo, day: dy });
        // const data = await res.json();

        // // Now add these to the service list
        // this.serviceList = [];
        // for(var i=0; i<data.length; i++) {
        //     const sInfo = new ServiceInfo(data[i]);
        //     this.serviceList.push(sInfo);
        // }
    }

    async createService(info:ServiceInfo) {
        await this.api.createData(API_CALLS.services, info);
    }

    async addMemberToService(info:any) {
        await this.api.createData(API_CALLS.schedule, info);     
        
        this.api.clearCache(API_CALLS.schedule);
        this.api.clearCache(API_CALLS.labelScheduled);        
    }

    async removeMemberFromService(info:any) {
        await this.api.removeData(API_CALLS.schedule, info);

        this.api.clearCache(API_CALLS.schedule);
        this.api.clearCache(API_CALLS.labelScheduled);
    }

    // This loads all the scheduled days in the month
    async loadServicesWithBufferDays(dt:Date){
        // get month / year as a string
        const month = (dt.getMonth() + 1).toString();
        const year = dt.getFullYear().toString();

        const res = await this.api.getData(API_CALLS.services, { church_id: this.uInfo.church_id, year: year, month: month });
        const data = await res.json();

        // Set of days in the month that have a service
        var monthSet = new Set<number>();

        // This load the church schedules in the month
        this.scheduleList = [];
        if (data != null && data.length > 0) {            
            for(var i=0; i<data.length; i++) {
                const d = data[i];
                const cid = d.church_id;
                const cSchedule = new ChurchSchedule(cid);

                // Create the service info
                const sInfo = new ServiceInfo(d);
                cSchedule.serviceInfo = sInfo;
                this.scheduleList.push(cSchedule);

                // Add it to the set of days
                monthSet.add(sInfo.serviceAsDate().getDate());
            }
        }

        // Now convert the set to an array
        this.monthlyDays = Array.from(monthSet);
    }

    async loadScheduledMembersForMonth(dt:Date) {
        // get month / year as a string
        const month = (dt.getMonth() + 1).toString();
        const year = dt.getFullYear().toString();

        // Reset schedule
        this.memberMap.forEach((value:any, key:string) => {
            value.clearScheduled();
        });

        // Get all the data for this month
        const res = await this.api.getData(API_CALLS.schedule, { church_id: this.uInfo.church_id, year: year, month: month });
        const data = await res.json();

        // Loop through the data, add the member (if needed). Add the scheduleInfo to the member
        if (data != null && data.length > 0) {
            for(var i=0; i<data.length; i++) {
                // Get schedule Info
                const sInfo = new ScheduleInfo(data[i]);

                // If the member exists, add this to the member
                if (this.memberMap.has(sInfo.member_id)) {
                    const mInfo = this.memberMap.get(sInfo.member_id);
                    if (mInfo) {
                        mInfo.addSchedule(sInfo);
                        this.memberMap.set(sInfo.member_id, mInfo);
                    }
                }
            }
        }


        // // Create a map of services, so we can add the members to the service
        // const serviceMap = new Map<string, ChurchSchedule>();
        // for (var i=0; i<this.scheduleList.length; i++) {
        //     const cSchedule = this.scheduleList[i];
        //     serviceMap.set(cSchedule.serviceInfo.service_id, cSchedule);
        // }

        // // Loop through the data and add it to the correct place
        // if (data != null && data.length > 0) {
        //     for( var i=0; i<data.length; i++) {
        //         const sInfo = new ScheduleInfo(data[i]);

        //         // Get the service, label, and member
        //         const cSchedule = serviceMap.get(sInfo.service_id);
        //         const lbl = cSchedule?.churchLabels.labelMap.get(sInfo.label_id);
        //         const mInfo = cSchedule?.churchLabels.memberMap.get(sInfo.member_id);

        //         // Add the member to the list of schecduled members
        //         if (cSchedule != undefined && lbl != undefined && mInfo != undefined) {
        //             lbl.addScheduled(mInfo);
        //             mInfo.addScheduledLabel(lbl.label_id);
        //         }
        //     }
        // }
    }

    // This loads all the scheduled people for the month
    // async loadScheduledInfo(dt:Date) {
        // // get month / year as a string
        // const month = (dt.getMonth() + 1).toString();
        // const year = dt.getFullYear().toString();

        // const res = await this.api.getData(API_CALLS.schedule, { church_id: this.uInfo.church_id, year: year, month: month });
        // const data = await res.json();

        // // TODO JLS, need to put the schedule info for each service
        // var scheduleList = [];
        // if (data != null && data.length > 0) {            
        //     for(var i=0; i<data.length; i++) {
        //         scheduleList.push(new ScheduleInfo(data[i]));
        //     }
        // }
        // this.schedule.setScheduleList(scheduleList);        
    // }

    // async loadBlockedOutDaysWithBuffer(dt:Date){
        // // Get month / year as a string
        // const min = getStartOfPreviousMonth(dt);
        // const max = getEndOfNextMonth(dt);

        // const res = await this.api.getData(API_CALLS.availability, { church_id: this.uInfo.church_id, min: min.getTime().toString(), max: max.getTime().toString() });
        // const data = await res.json();

        // const blockedOutList = [];
        // if (data != null && data.length > 0) {
        //     for(var i=0; i<data.length; i++) {            
        //         blockedOutList.push(new AvailabilityInfo(data[i]));
        //     }
        // }
        // this.schedule.setBlockedOutList(blockedOutList);
    // }


    // TODO JLS, this sets the scheduled member for each label
    // async fetchScheduledMembers(lblInfo:ChurchLabels) {
    //     const api = new APIHandler();
    //     const res = await api.getData(API_CALLS.schedule, { service_id: this.service_id});
    //     const data = await res.json();

    //     // First loop through and add the members, and add them to the label
    //     const memberMap = lblInfo.memberMap;
    //     const lblMap = lblInfo.labelMap;
    //     for (var i=0; i<data.length; i++) {
    //         const mInfo = new MinMemberInfo(data[i]);    
    //         memberMap.set(mInfo.member_id, mInfo);

    //         // Get the label
    //         if (lblMap.has(data[i].label_id)) {
    //             const lbl = lblMap.get(data[i].label_id);
    //             lbl?.addMember(mInfo);
    //         }
    //     }
    // }     

}