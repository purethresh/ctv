import { ScheduleStatus } from "./ScheduleStatus";

export interface IMinMemberInfo {
    member_id?:string;
    first?:string;
    last?:string;
    notes?:string;
    gender?:string;
    sub?:string;
};

export class MinMemberInfo implements IMinMemberInfo {
    member_id: string = '';
    first: string = '';
    last: string = '';
    notes: string = '';
    gender: string = '';
    sub: string = '';

    // Move this to Full Member Info

    // scheduledStatus:ScheduleStatus;
    // scheduledLabels:Set<string>;
    // numberOfTimesScheduled:number;

    constructor(obj:IMinMemberInfo = {}) {
        this.member_id = obj.member_id || '';
        this.first = obj.first || '';
        this.last = obj.last || '';
        this.notes = obj.notes || '';
        this.gender = obj.gender || 'male';
        this.sub = obj.sub || '';

        // By default we just mark this user as a member
        // this.scheduledStatus = ScheduleStatus.member;
        // this.scheduledLabels = new Set<string>();
        // this.numberOfTimesScheduled = 0;
    }

    isLinked() {
        return this.sub.length > 0;
    }

    // incrementNumberScheduled() {
    //     this.numberOfTimesScheduled++;
    // }

    // resetScheduled() {
    //     this.scheduledStatus = ScheduleStatus.member;
    //     this.scheduledLabels = new Set<string>();
    //     this.numberOfTimesScheduled = 0;
    // }

    // addScheduledLabel(label_id:string) {
    //     this.scheduledLabels.add(label_id);
    //     this.scheduledStatus = ScheduleStatus.scheduled;
    // }

    // setBockedOut() {
    //     this.scheduledStatus = ScheduleStatus.blockedOut;
    // }

    // static compare(a:MinMemberInfo, b:MinMemberInfo) {
    //     var result = 0;

        // // Check for blocked out status
        // if (a.scheduledStatus !== ScheduleStatus.blockedOut && b.scheduledStatus === ScheduleStatus.blockedOut) {
        //     result = -1;
        // }
        // else if (a.scheduledStatus === ScheduleStatus.blockedOut && b.scheduledStatus !== ScheduleStatus.blockedOut) {
        //     result = 1
        // }

        // Check for scheduled
    //     if (result === 0) {
    //         if (a.scheduledStatus !== ScheduleStatus.scheduled && b.scheduledStatus === ScheduleStatus.scheduled) {
    //             result = -1;
    //         }
    //         else if (a.scheduledStatus === ScheduleStatus.scheduled && b.scheduledStatus !== ScheduleStatus.scheduled) {
    //             result = 1;
    //         }
    //     }

    //     // Now check for number of times scheduled
    //     if (result === 0) {
    //         result = a.numberOfTimesScheduled - b.numberOfTimesScheduled;
    //     }

    //     return result;
    // }
}