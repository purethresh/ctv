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

    setMemberInfo(info:any) {
        this.first = info.first;
        this.last = info.last;
        this.member_id = info.member_id;      
        this.sub = info.sub;
        this.churchName = info.churchName;
        this.church_id = info.church_id;
    }

    async loadMemberAdminInfo(rootLabelId:string) {
        // TODO JLS, this isn't correct
        this.isMemberAdmin = false;
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

    setToNotAuthenticated() {
        this.sub = '';
        this.member_id = '';
        this.first = '';
        this.last = '';

        this.church_id = DEFAULT_CHURCH_ID;
        this.churchName = DEFAULT_CHURCH_NAME;
    }
}