import { PageData } from "./PageData";
import { API_CALLS } from "../lib/APIHandler";
import { AvailabilityInfo } from "../lib/AvailabilityInfo";
import { getMonthStart, getMonthEnd } from "../lib/DateUtils";

export class AvailabilityPageData extends PageData {
    blockOutList:number[];
    blockOutMap:Map<number, AvailabilityInfo>;
    blockFullList:AvailabilityInfo[];

    constructor() {
        super();
        this.blockOutList = [];
        this.blockOutMap = new Map<number, AvailabilityInfo>();
        this.blockFullList = [];
    }

    async addBlockOutDay(aInfo:AvailabilityInfo) {
        await this.api.postData(API_CALLS.availability, aInfo);

        const newData = this.blockFullList.concat([aInfo]);
        this.updateBlockOutData(newData);
    }

    async removeBlockOutDay(aInfo:AvailabilityInfo) {
        await this.api.removeData(API_CALLS.availability, {availability_id: aInfo.availability_id});

        // Remove from the list
        const newData = this.blockFullList.filter((item) => {
            return item.availability_id !== aInfo.availability_id;
        });

        this.updateBlockOutData(newData);
    }

    async loadBlockOutInfo(memberId:string, dt:Date) {
        // First calculate the start and end of the month
        const min = getMonthStart(dt);
        const max = getMonthEnd(dt);
        
        // Get the data
        const res = await this.api.getData(API_CALLS.availability, { member_id: memberId, min: min.toString(), max: max.toString() });
        const data = await res.json();

        // Update the data
       this.updateBlockOutData(data);
    }

    private updateBlockOutData(data:any) {
        // Reset current data
        this.blockOutList = [];
        this.blockOutMap.clear();
        this.blockFullList = [];

        // Loop through the data and track the days blocked out.
        if (data) {
            for(var i=0; i<data.length; i++) {
                const info = data[i] as any;
                const epoc = Number(info.blockOutDay);
                const dayNum = new Date(epoc).getDate();
        
                const aInfo = new AvailabilityInfo(info);
                this.blockOutMap.set(dayNum, aInfo);
                this.blockOutList.push(dayNum);
                this.blockFullList.push(aInfo);
            }
        }
        
        // Sort the list
        this.blockFullList.sort((a, b) => {
            return Number(a.blockOutDay) - Number(b.blockOutDay);
        });
        
    }

}