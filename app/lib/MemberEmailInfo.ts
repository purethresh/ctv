import { UpdateType } from './UpdateType';

export interface IMemberEmailInfo {
    email_id?:string;
    member_id?:string;
    email?:string;
    isPrimary?:string;
};

export class MemberEmailInfo {
    email_id: string = '';
    member_id: string = '';
    email: string = '';
    isPrimary: string = 'false';
    updateType:UpdateType;

    constructor(obj:IMemberEmailInfo = {}) {
        this.email_id = obj.email_id || '';
        this.member_id = obj.member_id || '';
        this.email = obj.email || '';
        this.isPrimary = obj.isPrimary || 'false';
        this.updateType = UpdateType.none;
    }
}