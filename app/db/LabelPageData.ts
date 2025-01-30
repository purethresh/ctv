import { PageData } from "./PageData";
import { API_CALLS } from "../lib/APIHandler";
import { v4 } from 'uuid';


export class LabelPageData extends PageData {
    
    constructor() {
        super();
    }
    
    async addMemberToLabel(memberId:string, labelId:string, asOwner:boolean) {
        const params = {member_id: memberId, label_id: labelId, owner:asOwner};
        await this.api.postData(API_CALLS.labelMember, params);
    }

    async removeMemberFromLabel(memberId:string, labelId:string) {
        await this.api.removeData(API_CALLS.labelMember, {member_id: memberId, label_id: labelId});
    }

    async removeLabel(labelId:string) {
        await this.api.removeData(API_CALLS.labels, {label_id: labelId});
    }

    async updateLabel(lbl:any) {
        if (lbl.label_id == '') {
            lbl.label_id = v4();
            await this.api.createData(API_CALLS.labels, lbl);
        }
        else {
            await this.api.postData(API_CALLS.labels, lbl);
        }        
    }
}