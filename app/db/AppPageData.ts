import { PageData } from "./PageData";
import { API_CALLS } from "../lib/APIHandler";
import { ServiceInfo } from "../lib/ServiceInfo";


export class AppPageData extends PageData {
    scheduled:any[];
    lastScheduled:Date;
    serviceList:ServiceInfo[];
    
    constructor() {
        super();
        this.scheduled = [];
        this.lastScheduled = new Date('01/01/2000');
        this.serviceList = [];
    }

    async loadScheduledDays(dt:Date) : Promise<boolean> {
        // If no church ID, then return
        if (this.uInfo.church_id == undefined) return false;

        // If the same date as previous request, then return
        if (this.lastScheduled.getDate() == dt.getDate()) return false;

        // Get list of services
        const res = await this.api.getData(API_CALLS.services, { church_id: this.uInfo.church_id, year: dt.getFullYear(), month: dt.getMonth()+1 });
        const data = await res.json();

        // Now add these to the service list
        this.scheduled = [];
        for(var i=0; i<data.length; i++) {
            const epoc = data[i].serviceTime;
            const sDate = new Date(epoc);
            this.scheduled.push(sDate.getDate());
        }

        return true;
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

}