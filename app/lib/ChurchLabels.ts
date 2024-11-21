export default class ChurchLabels {
    labelMap:Map<string, any> = new Map<string, any>();
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
                this.labelMap.set(data[i].label_id, data[i]);
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

}