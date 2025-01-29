import { API_CALLS } from "../lib/APIHanlder";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import { LinkPageData } from "./LinkPageData";

export class MemberPageData extends LinkPageData {
    currentMemberInfo:MinMemberInfo;
    
    constructor() {
        super();
        this.currentMemberInfo = new MinMemberInfo({});
    }
    
    async loadCurrentMember(member_id:string) {
        const res = await this.api.getData(API_CALLS.member, { member_id: member_id });
        const data = await res.json();
        if (data) {
            this.currentMemberInfo = new MinMemberInfo(data[0]);
        }        
    }
}