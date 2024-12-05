
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

    constructor(obj:IMinMemberInfo = {}) {
        this.member_id = obj.member_id || '';
        this.first = obj.first || '';
        this.last = obj.last || '';
        this.notes = obj.notes || '';
    }
}