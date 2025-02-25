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
    }
}