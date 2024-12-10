export interface IAvailabilityInfo {
  availability_id?:string;
  member_id?:string;
  blockOutDay?:string;
}

export class AvailabilityInfo {
  availability_id:string;
  member_id:string;
  blockOutDay:string;
  blockedAsDate:Date;
  blockedAsDateStr:string;

  constructor(info:IAvailabilityInfo = {}) {
    this.availability_id = info.availability_id || '';
    this.member_id = info.member_id || '';
    this.blockOutDay = info.blockOutDay || '0';
    this.blockedAsDate = new Date(Number(this.blockOutDay));
    this.blockedAsDateStr = this.blockedAsDate.toDateString();
  }
}