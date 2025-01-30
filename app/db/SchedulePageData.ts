import { PageData } from './PageData';
import { API_CALLS } from '../lib/APIHandler';
import { ServiceInfo } from '../lib/ServiceInfo';
import { ChurchSchedule } from '../lib/ChurchSchedule';
import { ScheduleInfo } from '../lib/ScheduleInfo';
import { getStartOfPreviousMonth, getEndOfNextMonth, getMinTimeForDay, getMaxTimeForDay } from '../lib/DateUtils';
import { AvailabilityInfo } from '../lib/AvailabilityInfo';
import ChurchLabels from '../lib/ChurchLabels';

export class SchedulePageData extends PageData {
    serviceList:ServiceInfo[];
    schedule:ChurchSchedule;

    constructor() {
        super();
        this.serviceList = [];
        this.schedule = new ChurchSchedule('');
    }

    async loadMemberInfo() {
        await super.loadMemberInfo();
        this.schedule = new ChurchSchedule(this.uInfo.church_id);
    }

    async loadServiceForDay(yr:number, mo:number, dy:number) {
        // If no church ID, then return
        if (this.uInfo.church_id == undefined) return;

        // Get list of services
        const res = await this.api.getData(API_CALLS.services, { church_id: this.uInfo.church_id, year: yr, month: mo, day: dy });
        const data = await res.json();

        // Now add these to the service list
        this.serviceList = [];
        for(var i=0; i<data.length; i++) {
            const sInfo = new ServiceInfo(data[i]);
            this.serviceList.push(sInfo);
        }
    }

    async addMemberToService(info:any) {
        await this.api.postData(API_CALLS.schedule, info);        
    }

    async removeMemberFromService(info:any) {
        await this.api.removeData(API_CALLS.schedule, info);
    }

    async loadScheduleWithBufferDays(dt:Date){
        // get month / year as a string
        const month = (dt.getMonth() + 1).toString();
        const year = dt.getFullYear().toString();

        const res = await this.api.getData(API_CALLS.schedule, { church_id: this.uInfo.church_id, year: year, month: month });
        const data = await res.json();

        var scheduleList = [];
        if (data != null && data.length > 0) {            
            for(var i=0; i<data.length; i++) {
                scheduleList.push(new ScheduleInfo(data[i]));
            }
        }
        this.schedule.setScheduleList(scheduleList);
    }

    async loadBlockedOutDaysWithBuffer(dt:Date){
        // Get month / year as a string
        const min = getStartOfPreviousMonth(dt);
        const max = getEndOfNextMonth(dt);

        const res = await this.api.getData(API_CALLS.availability, { church_id: this.uInfo.church_id, min: min.getTime().toString(), max: max.getTime().toString() });
        const data = await res.json();

        const blockedOutList = [];
        if (data != null && data.length > 0) {
            for(var i=0; i<data.length; i++) {            
                blockedOutList.push(new AvailabilityInfo(data[i]));
            }
        }
        this.schedule.setBlockedOutList(blockedOutList);
    }

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