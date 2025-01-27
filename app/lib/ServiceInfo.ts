import { API_CALLS, APIHandler } from "./APIHanlder";
import ChurchLabels from "./ChurchLabels";
import { MinMemberInfo } from "./MinMemberInfo";

export interface IServiceInfo {
    service_id?: string;
    church_id?: string;
    serviceTime?: number;
    name?: string;
    info?: string;
}

export class ServiceInfo {
    service_id: string;
    church_id: string;
    serviceTime: number;
    name: string;
    info: string;

    constructor(data:IServiceInfo) {
        this.service_id = data.service_id || '';
        this.church_id = data.church_id || '';
        this.serviceTime = data.serviceTime || 0;
        this.name = data.name || '';
        this.info = data.info || '';
    }

    serviceAsDate():Date {
        return new Date(this.serviceTime);
    }

    async fetchScheduledMembers(lblInfo:ChurchLabels) {
        const api = new APIHandler();
        const res = await api.getData(API_CALLS.schedule, { service_id: this.service_id});
        const data = await res.json();

        // First loop through and add the members, and add them to the label
        const memberMap = lblInfo.memberMap;
        const lblMap = lblInfo.labelMap;
        for (var i=0; i<data.length; i++) {
            const mInfo = new MinMemberInfo(data[i]);    
            memberMap.set(mInfo.member_id, mInfo);

            // Get the label
            if (lblMap.has(data[i].label_id)) {
                const lbl = lblMap.get(data[i].label_id);
                lbl?.addMember(mInfo);
            }
        }
    }
}