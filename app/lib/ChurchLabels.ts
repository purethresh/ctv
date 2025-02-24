import { FullMemberInfo } from "./FullMemberInfo";
import { LabelInfo } from "./LabelInfo";
import { MinMemberInfo } from "./MinMemberInfo";

interface IMemberLabel {
    isOwnerOfLabel?:string;
    label_id?:string;
};

export default class ChurchLabels {
    churchId:string = '';
    labelMap:Map<string, LabelInfo> = new Map<string, LabelInfo>();
    labelRoot:LabelInfo | null = null;
    // memberMap:Map<string, MinMemberInfo> = new Map<string, MinMemberInfo>();

    setAllLabels(data:any) {
        this.labelMap.clear();
        this.labelRoot = null;

        if (data) {
            for (let i=0; i<data.length; i++) {
                const info = data[i];
                const lbl = new LabelInfo(info);
                this.labelMap.set(data[i].label_id, lbl);

                if (lbl.owner_id.length <= 0) {
                    this.labelRoot = lbl;
                }
            }
        }

        // Now make this a graph
        this.labelMap.forEach((value:any, key:string) => {
            if (value.owner_id.length > 0) {
                const owner = this.labelMap.get(value.owner_id);
                if (owner) {
                    owner.addChildLabel(value);
                }
            }
        });        
    }

    clone() : ChurchLabels {
        var result = new ChurchLabels();

        // Loop through the labels, clone them and add them to the new list
        this.labelMap.forEach((value:LabelInfo, key:string) => {
            result.labelMap.set(key, value.clone());
            if (value.owner_id.length <= 0) {
                result.labelRoot = value;
            }
        });

        // Now make this a graph
        result.labelMap.forEach((value:any, key:string) => {
            if (value.owner_id.length > 0) {
                const owner = result.labelMap.get(value.owner_id);
                if (owner) {
                    owner.addChildLabel(value);
                }
            }
        });

        // result.memberMap = this.memberMap;  // TODO JLS, should I clone, or just copy

        return result;
    }

    async setScheduledLabels(data:any) {     
        // Clear the list before loading
        if (this.labelRoot) {
            this.labelRoot.clearScheduled();
        }

        if (data) {
            for (let i=0; i<data.length; i++) {
                const sInfo = data[i];
                // Get the label by id
                const lbl = this.labelMap.get(sInfo.label_id);
                // Now add a scheduled person to the label
                if (lbl) {
                    lbl.addScheduled(sInfo.member_id);
                    // const member = lbl.memberMap.get(sInfo.member_id);
                    // if (member) {
                    //     member.addScheduledLabel(lbl.label_id);
                    //     lbl.addScheduled(member);
                    // }
                }
            }
        }
    }

    async setMemberLabels(data:any) {        
        // Loop through the data and add member to each label
        for (var i=0; i<data.length; i++) {
            const d = data[i];
            const lblId = d.label_id;
            const isOwner = d.isOwnerOfLabel !== 'false';

            // Get the label by id
            const lbl = this.labelMap.get(lblId);
            if (lbl) {
                lbl.addMember(d.member_id);

                // If owner, add it as an owner
                if (isOwner) {
                    lbl.addOwner(d.member_id);
                }
            }
        }
    }

    // async setMembersForLabel(data:any) {

    //     if (data) {
    //         for(var i=0; i<data.length; i++) {
    //             const d = data[i];
    //             const lblId = d.label_id;
    //             const mId = d.member_id;

    //             // Get the proper member obj
    //             var member = new MinMemberInfo(d);
    //             if (this.memberMap.has(mId)) {
    //                 member = this.memberMap.get(mId) as MinMemberInfo;
    //             }
    //             else {
    //                 this.memberMap.set(mId, member);
    //             }

    //             const lbl = this.labelMap.get(lblId);
    //             if (lbl) {
    //                 lbl.addMember(member.member_id);
    //             }
    //         }
    //     }
    // }

    async setOwnersForLabel(data:any) {
        if (data) {
            for(var i=0; i<data.length; i++) {
                const d = data[i];
                const lblId = d.label_id;
                const member = new MinMemberInfo(d);

                const lbl = this.labelMap.get(lblId);
                if (lbl) {
                    lbl.addOwner(member.member_id);
                }
            }
        }
    }    

    getMemberMap() : Map<string, MinMemberInfo> {
        return new Map<string, MinMemberInfo>();    // TODO JLS
        // return this.memberMap;
    }

    getLabelGroups() : LabelInfo[] {
        var resultMap:Map<string, LabelInfo> = new Map<string, LabelInfo>();

        // Only process labels that are for scheduling
        // If the parent is a group, then add it to the list
        // Otherwise add the label to the list
        this.labelMap.forEach((value:LabelInfo, key:string) => {
            if (value.forSchedule) {
                var parent = value.parentLabel as LabelInfo;
                // Check if the parent is a group
                if (parent && parent.scheduleGroup) {            
                    resultMap.set(parent.label_id, parent);
                }
                else {
                    // Otherwise we are adding it to the list
                    resultMap.set(value.label_id, value);
                }
            }
        });

        // Now convert the map to an array
        var result:LabelInfo[] = [];
        resultMap.forEach((value:any, key:string) => {
            result.push(value);
        });

        // Sort the results
        result.sort((a, b) => {
            if (a.labelName < b.labelName) {
                return -1;
            }
            if (a.labelName > b.labelName) {
                return 1;
            }
            return 0;
        });

        return result;
    }

    getMembership(memberId:string) : LabelInfo[] {
        var result:LabelInfo[] = [];

        this.labelMap.forEach((value:LabelInfo, key:string) => {
            if (value.isMember(memberId)) {
                result.push(value);
            }
        });

        return result;
    }

    getOwnership(memberId:string) : LabelInfo[] {
        var result:LabelInfo[] = [];

        this.labelMap.forEach((value:LabelInfo, key:string) => {
            if (value.isOwner(memberId)) {
                result.push(value);
            }
        });

        return result;
    }

    getMemberAndOwner(memberId:string) : LabelInfo[] {
        var result:LabelInfo[] = [];

        this.labelMap.forEach((value:LabelInfo, key:string) => {
            if (value.isMember(memberId) || value.isOwner(memberId)) {
                result.push(value);
            }
        });

        return result;
    }

}