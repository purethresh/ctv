
import { MinMemberInfo } from "./MinMemberInfo";

// This is a label.
// It could have multiple people assigned to it

export interface ILabelInfo {
    label_id?:string;
    labelName?:string;
    labelDescription?:string;
    forSchedule?:string;
    scheduleGroup?:string;
    owner_id?:string;
    church_id?:string;
}

export class LabelInfo {
    // Label Properties
    church_id:string;
    label_id:string;
    labelName:string;
    labelDescription:string;
    forSchedule:boolean;
    scheduleGroup:boolean;
    owner_id:string;

    // Labels can have both a parent and children
    parentLabel:LabelInfo | null;
    childLabels:LabelInfo[];

    // Labels can have members
    memberMap:Map<string, MinMemberInfo>;

    // Labels can have owners
    owners:Map<string, MinMemberInfo>;

    // List of people scheduled for this label
    scheduled:MinMemberInfo[];

    constructor(info:ILabelInfo = {}) {
        this.label_id = info.label_id || '';
        this.labelName = info.labelName || '';
        this.labelDescription = info.labelDescription || '';
        this.owner_id = info.owner_id || '';
        this.church_id = info.church_id || '';

        if (info.forSchedule == undefined) {
            this.forSchedule = false;
        }
        else {
            this.forSchedule = info.forSchedule !== 'false';
        }

        if (info.scheduleGroup == undefined) {
            this.scheduleGroup = false;
        }
        else {
            this.scheduleGroup = info.scheduleGroup !== 'false';
        }

        this.parentLabel = null;
        this.childLabels = [];
        this.memberMap = new Map<string, MinMemberInfo>();
        this.owners = new Map<string, MinMemberInfo>();
        this.scheduled = [];
    }

    addChildLabel(label:LabelInfo) {
        // First add it to the child list
        this.childLabels.push(label);

        // Sort
        this.childLabels.sort((a:LabelInfo, b:LabelInfo) => {
            if (a.labelName < b.labelName) {
                return -1;
            }
            if (a.labelName > b.labelName) {
                return 1;
            }
            return 0;
        });

        // Link parent
        label.parentLabel = this;
    }

    addMember(member:MinMemberInfo) {     
        this.memberMap.set(member.member_id, member); 
    }

    removeMember(memberId:string) {
        this.memberMap.delete(memberId);        
    }

    isMember(memberId:string) {
        return this.memberMap.has(memberId);
    }

    getMemberList() : MinMemberInfo[] {
        var result:MinMemberInfo[] = [];
        this.memberMap.forEach((value:MinMemberInfo, key:string) => {
            result.push(value);
        });

        return result;
    }

    isOwner(memberId:string) {
        return this.owners.has(memberId);
    }

    addOwner(owner:MinMemberInfo) {
        this.owners.set(owner.member_id, owner);

        // Loop through and add this as an owner to all the children too
        this.childLabels.forEach((child) => {
            child.addOwner(owner);
        });
    }

    removeOwner(ownerId:string) {
        this.owners.delete(ownerId);

        // Loop through and remove this as an owner from all the children
        this.childLabels.forEach((child) => {
            child.removeOwner(ownerId);
        });
    }

    getOwnerList() : MinMemberInfo[] {
        var result:MinMemberInfo[] = [];
        this.owners.forEach((value:MinMemberInfo, key:string) => {
            result.push(value);
        });

        return result;
    }   

    clearScheduled() {
        this.scheduled = [];
        for(var i=0; i<this.childLabels.length; i++) {
            this.childLabels[i].clearScheduled();
        }
    }

    addScheduled(scheduled:MinMemberInfo) {
        this.scheduled.push(scheduled);
    }
}