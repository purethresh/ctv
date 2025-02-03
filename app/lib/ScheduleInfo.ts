export interface IScheduleInfo {
    schedule_id?:string;
    church_id?:string;
    label_id?:string;
    member_id?:string;
    service_id?:string;
    serviceTime?:number;
};

export class ScheduleInfo {
    schedule_id:string;
    church_id:string;
    label_id:string;
    member_id:string;
    service_id:string;
    serviceTime:number;

    constructor(obj:IScheduleInfo = {}) {
        this.schedule_id = obj.schedule_id || '';
        this.church_id = obj.church_id || '';
        this.label_id = obj.label_id || '';
        this.member_id = obj.member_id || '';
        this.service_id = obj.service_id || '';
        this.serviceTime = obj.serviceTime || 0;
    }
}