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
    useCache:boolean = true;

    async fetchAllLabels(churchId:string) {
        this.churchId = churchId;

        this.labelMap.clear();
        this.labelRoot = null;

        // If no church ID, then return
        if (churchId.length <= 0) {
            return;
        }

        // Get all the labels for the church
        const res = await this.doGet('/api/labels?church_id=' + churchId);
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
        if (this.labelRoot) {
            this.labelRoot.clearScheduled();
        }

        // If no service id, then return
        if (serviceId.length <= 0) {
            return;
        }

        // Get the scheduled labels for a specific service
        const res = await this.doGet('/api/labels/scheduled?service_id=' + serviceId);
        const data = await res.json();

        if (data) {
            for (let i=0; i<data.length; i++) {
                const sInfo = data[i];
                // Get the label by id
                const lbl = this.labelMap.get(sInfo.label_id);

                // Now add a scheduled person to the label
                if (lbl) {
                    lbl.addScheduled(new MinMemberInfo(sInfo));
                }
            }
        }
    }

    async fetchMemberLabels(memberId:string) {
        // Get the scheduled labels for a specific service
        const res = await this.doGet('/api/labels/member?member_id=' + memberId);
        const data = await res.json();

        // Loop through the data and add member to each label
        for (var i=0; i<data.length; i++) {
            const d = data[i];
            const lblId = d.label_id;
            const member = new MinMemberInfo(d);
            const isOwner = d.isOwnerOfLabel !== 'false';

            // Get the label by id
            const lbl = this.labelMap.get(lblId);
            if (lbl) {
                lbl.addMember(member);

                // If owner, add it as an owner
                if (isOwner) {
                    lbl.addOwner(member);
                }
            }
        }
    }

    async fetchMembersForLabel(labelId:string) {
        // Get the scheduled labels for a specific service
        const res = await this.doGet('/api/labels/member?label_id=' + labelId);  
        const data = await res.json();

        for(var i=0; i<data.length; i++) {
            const d = data[i];
            const lblId = d.label_id;
            const member = new MinMemberInfo(d);

            const lbl = this.labelMap.get(lblId);
            if (lbl) {
                lbl.addMember(member);
            }
        }
    }

    // For every label that can be scheduled, get all the members
    async fetchMembersForScheduledLabels() {
        // Create a list of all the scheduled labels
        var scheduledLabels:LabelInfo[] = [];
        this.labelMap.forEach((value:any, key:string) => {
            if (value.forSchedule) {
                scheduledLabels.push(value);
            }
        });

        // Now loop through the scheduled labels and get the members
        for(var i=0; i<scheduledLabels.length; i++) {
            const lbl = scheduledLabels[i];
            await this.fetchMembersForLabel(lbl.label_id);
        }
    }

    async fetchOwnersForLabel(labelId:string) {
        // Get the scheduled labels for a specific service
        const res = await this.doGet('/api/labels/member?owner_id=' + labelId);
        const data = await res.json();

        for(var i=0; i<data.length; i++) {
            const d = data[i];
            const lblId = d.label_id;
            const member = new MinMemberInfo(d);

            const lbl = this.labelMap.get(lblId);
            if (lbl) {
                lbl.addOwner(member);
            }
        }
    }    

    getLabelGroups() : LabelInfo[] {
        var resultMap:Map<string, LabelInfo> = new Map<string, LabelInfo>();

        // Loop through the labels and add parents of scheduled labels
        this.labelMap.forEach((value:any, key:string) => {
            if (value.forSchedule) {
                var parent = value.parentLabel;
                if (parent) {
                    resultMap.set(parent.label_id, parent);
                }
            }
        });

        var result:LabelInfo[] = [];
        resultMap.forEach((value:any, key:string) => {
            result.push(value);
        });

        // Now sort the result
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

    async doGet(url:string) : Promise<Response> {
        if (this.useCache) {
            return fetch(url, { cache: 'force-cache' });
        }
        else {
            return fetch(url);
        }
    }

    shouldUseCache(useCache:boolean) {
        this.useCache = useCache;
    }



}