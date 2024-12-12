


export class ChurchSchedule {
    church_id:string;
    useCache:boolean = true;

    constructor(church_id:string) {
        this.church_id = church_id;
    }

    // This gets all the schedules for the month of the date, plus the month before and the month after
    fetchScheduleWithBuffer = async(dt:Date) => {
        // get month / year as a string
        const month = (dt.getMonth() + 1).toString();
        const year = dt.getFullYear().toString();

        // const res = await this.doGet('/api/schedule?church_id=' + this.church_id + '&year=' + year + '&month=' + month);
        const res = await this.doGet(`/api/schedule?church_id=${this.church_id}&year=${year}&month=${month}`);
        const data = await res.json();

        console.log(data);
    }

    private async doGet(url:string) : Promise<Response> {
        if (this.useCache) {
            return fetch(url, { cache: 'force-cache' });
        }
        else {
            return fetch(url);
        }
    }

    // TODO JLS - need to figure out how to use this.
}