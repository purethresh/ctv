export enum API_CALLS {
    availability = '/api/available',
    church = '/api/church',
    labels = '/api/labels',
    labelMember = '/api/labels/member',
    labelScheduled = '/api/labels/scheduled',
    member = '/api/member',
    address = '/api/member/address',
    memberAdmin = '/api/member/admin',
    email = '/api/member/email',
    schedule = '/api/schedule',
    services = '/api/services',
    phone = '/api/member/phone'
}

export class APIHandler {
    
    async getData(api: API_CALLS, params: any, useCache: boolean) : Promise<Response> {
        var result:any = null;

        const req:RequestInit = {
            method: 'GET',
        }

        // Add directive to use cache
        if (useCache) {
            req.cache = 'force-cache';
        }

        // Get the data
        result = await fetch(this.createFullURL(api, params), req);

        return result;
    }

    async postData(api: API_CALLS, params: any) : Promise<Response> {
        var result:any = null;

        const req:RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        }

        // Get the data
        result = await fetch(this.createFullURL(api, {}), req);

        return result;
    }

    async createData(api: API_CALLS, params: any) : Promise<Response> {
        var result:any = null;

        const req:RequestInit = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        }

        // Get the data
        result = await fetch(this.createFullURL(api, {}), req);

        return result;
    }

    async removeData(api: API_CALLS, params: any) : Promise<Response> {
        var result:any = null;

        const req:RequestInit = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        }

        // Get the data
        result = await fetch(this.createFullURL(api, {}), req);

        return result;
    }

    private createFullURL(api: API_CALLS, params: any) : string {
        var result = api + this.createParams(api, params);
        return result;
    }


    private createParams(api: API_CALLS, params: object) : string {
        var result = "";

        // Loop through the properties of params
        Object.keys(params).forEach((key) => {
            if (result.length > 0) {
                result += "&";
            }
            else {
                result += "?";
            }
            // @ts-ignore
            result += `${key}=${params[key]}`;
        });

        return result;
    }
}