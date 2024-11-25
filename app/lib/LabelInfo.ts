
import { MinMemberInfo } from "./MinMemberInfo";

// This is a label.
// It could have multiple people assigned to it

interface ILabelInfo {
    label_id?:string;
    labelName?:string;
    labelDescription?:string;
    forSchedule?:string;
    owner_id?:string;
    church_id?:string;
}

export default class LabelInfo {
    // Label Properties
    church_id:string;
    label_id:string;
    labelName:string;
    labelDescription:string;
    forSchedule:boolean;
    owner_id:string;

    // Labels can have both a parent and children
    parentLabel:LabelInfo | null;
    childLabels:LabelInfo[];

    // Labels can have members
    members:MinMemberInfo[];

    // Labels can have owners
    owners:MinMemberInfo[];

    // List of people scheduled for this label
    scheduled:MinMemberInfo[];

    constructor(info:ILabelInfo = {}) {
        // const lInfo = info as LabelInfoProps;

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

        this.parentLabel = null;
        this.childLabels = [];
        this.members = [];
        this.owners = [];
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
        this.members.push(member);
    }

    addOwner(owner:MinMemberInfo) {
        this.owners.push(owner);

        // Loop through and add this as an owner to all the children too
        this.childLabels.forEach((child) => {
            child.addOwner(owner);
        });
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