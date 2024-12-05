export interface IMemberPhoneInfo {
    phone_id?:string;
    member_id?:string;
    pNumber?:string;
    isPrimary?:string;
};

export class MemberPhoneInfo {
    phone_id: string = '';
    member_id: string = '';
    pNumber: string = '';
    isPrimary: string = 'false';

    constructor(obj:IMemberPhoneInfo = {}) {
        this.phone_id = obj.phone_id || '';
        this.member_id = obj.member_id || '';
        this.pNumber = obj.pNumber || '';
        this.isPrimary = obj.isPrimary || 'false';
    }
}