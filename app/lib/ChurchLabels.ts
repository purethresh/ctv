import LabelInfo from "./LabelInfo";

interface IMemberLabel {
    isOwnerOfLabel?:string;
    label_id?:string;
};

export default class ChurchLabels {
    currentChurchId:string = '';
    labelMap:Map<string, LabelInfo> = new Map<string, LabelInfo>();
    labelRoot:LabelInfo | null = null;
    scheduledMap:Map<string, any> = new Map<string, any>();
    memberLabels:IMemberLabel[] = [];

    async fetchAllLabels(churchId:string) {
        this.currentChurchId = churchId;
        
        // Clear the list before loading
        this.labelMap.clear();

        // If no church ID, then return
        if (churchId.length <= 0) {
            return;
        }

        // Get all the labels for the church
        const res = await fetch('/api/labels?church_id=' + churchId, { cache: 'force-cache' });
        const data = await res.json();

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

    async fetchScheduledLabels(serviceId:string) {
        // Clear the list before loading
        this.scheduledMap.clear();

        // If no service id, then return
        if (serviceId.length <= 0) {
            return;
        }

        // Get the scheduled labels for a specific service
        const res = await fetch('/api/labels/scheduled?service_id=' + serviceId, { cache: 'force-cache' });
        const data = await res.json();

        if (data) {
            for (let i=0; i<data.length; i++) {
                this.scheduledMap.set(data[i].label_id, data[i]);
            }
        }
    }

    async fetchMemberLabels(memberId:string) {
        this.memberLabels = [];

        // Get the scheduled labels for a specific service
        const res = await fetch('/api/labels/member?member_id=' + memberId, { cache: 'force-cache' });
        this.memberLabels = (await res.json()) as IMemberLabel[];
    }

    getLabelGroups() : LabelInfo[] {
        const resultMap:Map<string, LabelInfo> = new Map<string, LabelInfo>();

        // Loop through the people scheduled and add them to the labels
        this.scheduledMap.forEach((value:any, key:string) => {
            const label = this.labelMap.get(value.label_id);
            if (label) {
                label.scheduled.push(value);
            }
        });

        // Loop through the labels, create a group for every scheduled label
        this.labelMap.forEach((value:any, key:string) => {
            if (value.forSchedule) {
                const owner = value.owner_id;
                if (!resultMap.has(owner)) {
                    const ownerLbl = this.labelMap.get(owner);
                    const group = new LabelInfo(ownerLbl);
                    resultMap.set(owner, group);
                }

                // Now add it to the group
                const group = resultMap.get(owner);
                group?.addChildLabel(value);
            }
        });

        var result:LabelInfo[] = [];
        resultMap.forEach((value:any, key:string) => {
            // Sort the children and add them to the result
            value.sortChildLabels();
            result.push(value);
        });

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

    getMemberLabels() : LabelInfo[] {

        // Loop through the member labels and set flags for all labels
        for (var i=0; i<this.memberLabels.length; i++) {
            const memberInfo = this.memberLabels[i];
            this.setMemberOfLabelAndChildren(memberInfo.label_id || '', memberInfo.isOwnerOfLabel !== 'false');
        }

        // Now get the labels that are members
        var result:LabelInfo[] = [];
        this.labelMap.forEach((value:any, key:string) => {
            if (value.isMemberOfLabel) {
                value.sortChildLabels();
                result.push(value);
            }
        });

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

    isAdministrator() : boolean {
        var result = false;

        // Get the root label
        if (this.labelRoot) {
            if (this.labelRoot.isOwnerOfLabel) {
                result = true;
            }
        }

        return result;
    }

    private setMemberOfLabelAndChildren(labelId:string, isOwner:boolean) {
        if (labelId.length <= 0) {
            return;
        }

        const lbl = this.labelMap.get(labelId);
        if (lbl) {
            lbl.isMemberOfLabel = true;
            lbl.isOwnerOfLabel = lbl.isOwnerOfLabel || isOwner;

            // Now mark the same for all the children
            for (var i=0; i<lbl.childLabels.length; i++) {
                this.setMemberOfLabelAndChildren(lbl.childLabels[i].label_id, isOwner);
            }
        }
    }

    private resetMembership() {
        this.labelMap.forEach((value:any, key:string) => {
            value.isMemberOfLabel = false;
            value.isOwnerOfLabel = false;
        });
    }

}