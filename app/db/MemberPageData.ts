import { API_CALLS } from "../lib/APIHandler";
import { MemberPhoneInfo } from "../lib/MemberPhoneInfo";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import { LinkPageData } from "./LinkPageData";
import { MemberEmailInfo } from "../lib/MemberEmailInfo";
import { MemberAddressInfo } from "../lib/MemberAddressInfo";
import { UpdateType } from "../lib/UpdateType";

export class MemberPageData extends LinkPageData {
    currentMemberInfo:MinMemberInfo;
    currentPhoneList:MemberPhoneInfo[];
    currentEmailList:MemberEmailInfo[];
    currentAddressList:MemberAddressInfo[];
    
    constructor() {
        super();
        this.currentMemberInfo = new MinMemberInfo({});
        this.currentPhoneList = [];
        this.currentEmailList = [];
        this.currentAddressList = [];
    }
    
    async loadCurrentMember(member_id:string) {
        const res = await this.api.getData(API_CALLS.member, { member_id: member_id });
        const data = await res.json();
        if (data) {
            this.currentMemberInfo = new MinMemberInfo(data[0]);
        }        
    }

    async updateMember(memberInfo:MinMemberInfo) {
        await this.api.postData(API_CALLS.member, memberInfo);
    }

    async createMember(memberInfo:MinMemberInfo) {
        await this.api.createData(API_CALLS.member, memberInfo);
    }

    async loadPhoneList(member_id:string) {
        const result = await this.api.getData(API_CALLS.phone, { member_id: member_id });
        var data = await result.json();

        this.currentPhoneList = [];
        for(var i=0; i<data.length; i++) {
            const pInfo = new MemberPhoneInfo(data[i]);
            this.currentPhoneList.push(pInfo);
        }
    }

    async loadEmailList(member_id:string) {
        const result = await this.api.getData(API_CALLS.email, { member_id: member_id });
        var data = await result.json();

        this.currentEmailList = [];
        for(var i=0; i<data.length; i++) {
            const eInfo = new MemberEmailInfo(data[i]);
            this.currentEmailList.push(eInfo);
        }
    }

    async loadAddressList(member_id:string) {
        const result = await this.api.getData(API_CALLS.address, { member_id: member_id });
        var data = await result.json();

        this.currentAddressList = [];
        for(var i=0; i<data.length; i++) {
            const aInfo = new MemberAddressInfo(data[i]);
            this.currentAddressList.push(aInfo);
        }
    }

    async updatePhoneList(phoneList:MemberPhoneInfo[], member_id:string) {
        // Loop through the list
        for(var i=0; i<phoneList.length; i++) {
            const pInfo = phoneList[i];
            pInfo.member_id = member_id;
            if (pInfo.updateType === UpdateType.update) {
                await this.api.postData(API_CALLS.phone, pInfo);
            } else if (pInfo.updateType === UpdateType.create) {
                await this.api.createData(API_CALLS.phone, pInfo);
            }
        }
    }

    async updateEmailList(emailList:MemberEmailInfo[], member_id:string) {
        // Loop through the list
        for(var i=0; i<emailList.length; i++) {
            const eInfo = emailList[i];
            eInfo.member_id = member_id;
            if (eInfo.updateType === UpdateType.update) {
                await this.api.postData(API_CALLS.email, eInfo);
            } else if (eInfo.updateType === UpdateType.create) {
                await this.api.createData(API_CALLS.email, eInfo);
            }
        }
    }
    
    async updateAddressList(addressList:MemberAddressInfo[], member_id:string) {
        // Loop through the list
        for(var i=0; i<addressList.length; i++) {
            const aInfo = addressList[i];
            aInfo.member_id = member_id;
            if (aInfo.updateType === UpdateType.update) {
                await this.api.postData(API_CALLS.address, aInfo);
            } else if (aInfo.updateType === UpdateType.create) {
                await this.api.createData(API_CALLS.address, aInfo);
            }
        }
    }      
}