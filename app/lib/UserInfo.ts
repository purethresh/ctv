import { fetchUserAttributes } from "aws-amplify/auth";
import { API_CALLS, APIHandler } from "./APIHanlder";

const DEFAULT_CHURCH_ID = '13943128-2c3c-408a-ad0d-7500578acc54';
const DEFAULT_CHURCH_NAME = 'Calvary Tri Valley';

export default class UserInfo {
    sub:string = '';
    member_id:string = '';
    church_id:string = '';
    churchName:string = '';
    first:string = '';
    last:string = '';
    isMemberAdmin:boolean = false;

    constructor() {
        this.setToNotAuthenticated();
    }

    // This checks the auth to see if the user is logged in
    // If they are, it attempts to load info
    async loadMemberInfo() {
      try {
        let aInfo = await fetchUserAttributes();
        if (aInfo && aInfo.sub) {
            this.sub = aInfo.sub;

            // Get Member info
            await this.getMemberInfo(this.sub);
        }
      }
      catch(e) {
        this.setToNotAuthenticated();
      }
    }

    async loadMemberAdminInfo(rootLabelId:string) {
        this.isMemberAdmin = false;

        // Finding out if the member belongs to the church-member-admin label
        const api = new APIHandler();
        const res = await api.getData(API_CALLS.memberAdmin, { root_id: rootLabelId, member_id: this.member_id });
        const data = await res.json();

        if (data && data.isAdmin === true) {
            this.isMemberAdmin = true;
        }
    }

    getInitials() {
        var result = '';

        if (this.first && this.first.length > 0) {
            result += this.first[0];
        }
        if (this.last && this.last.length > 0) {
            result += this.last[0];
        }
        return result;
    }

    isLinkedMember() {
        return this.member_id !== undefined && this.member_id.length > 0;
    }

    private async getMemberInfo(subId:string) {
        if (subId && subId.length > 0) {
            // Get the member info by looking for the sub
            const api = new APIHandler();
            const res = await api.getData(API_CALLS.member, { sub: subId });
            const data = await res.json();
            if (data) {
                this.first = data.first;
                this.last = data.last;
                this.member_id = data.member_id;
                await this.getChurchInfo(data.member_id);
            }
        }        
    }

    private async getChurchInfo(memberId:string) {
        if (memberId && memberId.length > 0) {
            // Get the church info by looking for the member_id
            const api = new APIHandler();
            const res = await api.getData(API_CALLS.church, { member_id: memberId });
            const data = await res.json();
            if (data) {
                this.church_id = data.church_id;
                this.churchName = data.churchName;
            }
        }
    }

    private setToNotAuthenticated() {
        this.sub = '';
        this.member_id = '';
        this.first = '';
        this.last = '';

        this.church_id = DEFAULT_CHURCH_ID;
        this.churchName = DEFAULT_CHURCH_NAME;
    }
}