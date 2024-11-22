import GroupLabelInfo from "./GroupLabelInfo";
import LabelInfo from "./LabelInfo";

export default class ChurchLabels {
    labelMap:Map<string, LabelInfo> = new Map<string, LabelInfo>();
    scheduledMap:Map<string, any> = new Map<string, any>();


    async fetchAllLabels(churchId:string) {
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
                this.labelMap.set(data[i].label_id, new LabelInfo(info));
            }
        }
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

    getLabelGroups() : GroupLabelInfo[] {
        const resultMap:Map<string, GroupLabelInfo> = new Map<string, GroupLabelInfo>();

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
                    const group = new GroupLabelInfo(ownerLbl);
                    resultMap.set(owner, group);
                }

                // Now add it to the group
                const group = resultMap.get(owner);
                group?.addChildLabel(value);
            }
        });

        var result:GroupLabelInfo[] = [];
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

}