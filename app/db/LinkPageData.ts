import { PageData } from "./PageData";
import { API_CALLS } from "../lib/APIHandler";


export class LinkPageData extends PageData {
    
    constructor() {
        super();
    }
    
    async linkMember(memberId: string, sub: string) {
        const memberParams = { member_id: memberId, sub: sub };
        const mResult = await this.api.createData(API_CALLS.memberLink, memberParams);
    }

    async unlinkMember(memberId: string) {
        const memberParams = { member_id: memberId };
        const mResult = await this.api.removeData(API_CALLS.memberLink, memberParams);
    }
}