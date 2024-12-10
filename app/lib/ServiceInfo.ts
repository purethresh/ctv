export interface IServiceInfo {
    service_id?: string;
    church_id?: string;
    serviceTime?: number;
    name?: string;
    info?: string;
}

export class ServiceInfo {
    service_id: string;
    church_id: string;
    serviceTime: number;
    name: string;
    info: string;

    constructor(data:IServiceInfo) {
        this.service_id = data.service_id || '';
        this.church_id = data.church_id || '';
        this.serviceTime = data.serviceTime || 0;
        this.name = data.name || '';
        this.info = data.info || '';
    }

    serviceAsDate():Date {
        return new Date(this.serviceTime);
    }
}