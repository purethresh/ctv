import { fetchUserAttributes } from "aws-amplify/auth";

const DEFAULT_CHURCH_ID = 'asdf';
const DEFAULT_CHURCH_NAME = 'Calvary Tri Valley';

export default class UserInfo {
    sub:string = '';
    member_id:string = '';
    church_id:string = '';
    churchName:string = '';
    first:string = '';
    last:string = '';

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

    private async getMemberInfo(subId:string) {
        if (subId && subId.length > 0) {
            // Get the member info by looking for the sub
            const res = await fetch('/api/member?sub=' + subId, { cache: 'force-cache' });
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
            const res = await fetch('/api/church?member_id=' + memberId, { cache: 'force-cache' });
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