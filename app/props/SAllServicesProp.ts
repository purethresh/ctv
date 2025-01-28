import { ServiceInfo } from "../lib/ServiceInfo";


export interface SAllServicesProp {
    serviceDate?: string;
    serviceList: ServiceInfo[];
    loadServiceList: (yr:number, mo:number, dy:number) => void;
}