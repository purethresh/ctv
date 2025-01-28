import { PageData } from "./PageData";
import { API_CALLS } from "../lib/APIHanlder";


export class LinkPageData extends PageData {
    
    constructor() {
        super();
    }
    
    async linkMember(memberId: string, sub: string) {
        const memberParams = { member_id: memberId, sub: sub };
        const mResult = await this.api.createData(API_CALLS.memberLink, memberParams);
    }
}