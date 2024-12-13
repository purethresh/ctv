import { ScheduleStatus } from "./ScheduleStatus";

export interface IMinMemberInfo {
    member_id?:string;
    first?:string;
    last?:string;
    notes?:string;
};

export class MinMemberInfo {
    member_id: string = '';
    first: string = '';
    last: string = '';
    notes: string = '';

    scheduledStatus:ScheduleStatus;
    scheduledLabels:Set<string>;
    numberOfTimesScheduled:number;

    constructor(obj:IMinMemberInfo = {}) {
        this.member_id = obj.member_id || '';
        this.first = obj.first || '';
        this.last = obj.last || '';
        this.notes = obj.notes || '';

        // By default we just mark this user as a member
        this.scheduledStatus = ScheduleStatus.member;
        this.scheduledLabels = new Set<string>();
        this.numberOfTimesScheduled = 0;
    }

    incrementNumberScheduled() {
        this.numberOfTimesScheduled++;
    }

    resetScheduled() {
        this.scheduledStatus = ScheduleStatus.member;
        this.scheduledLabels = new Set<string>();
        this.numberOfTimesScheduled = 0;
    }

    addScheduledLabel(label_id:string) {
        this.scheduledLabels.add(label_id);
        this.scheduledStatus = ScheduleStatus.scheduled;
    }
}