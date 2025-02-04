export enum API_CALLS {
    availability = '/api/available',
    church = '/api/church',
    labels = '/api/labels',
    labelMember = '/api/labels/member',
    labelScheduled = '/api/labels/scheduled',
    member = '/api/member',
    address = '/api/member/address',
    memberAdmin = '/api/member/admin',
    memberLink = '/api/member/link',
    email = '/api/member/email',
    schedule = '/api/schedule',
    services = '/api/services',
    phone = '/api/member/phone'
}

export class APIHandler {
    // This is a set of all the get requests. So we can use cache for all the items in this set
    static cacheMap:Map<API_CALLS, Set<string>> = new Map<API_CALLS, Set<string>>();
    
    async getData(api: API_CALLS, params: any) : Promise<Response> {
        var result:any = null;

        const req:RequestInit = {
            method: 'GET',
        }

        // Get the url we are going to use
        const url = this.createFullURL(api, params);

        // If we have gotten this data before, then we can use the cache
        const hasCache = this.hasCache(api, url);
        if (hasCache) {
            req.cache = 'force-cache';
        }

        // Add the API to the cached set. So we get cache in the next call
        if (!hasCache) {            
            this.trackCache(api, url);
        }
        
        // Get the data
        result = await fetch(url, req);

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

        // Clear the cache for this API
        this.clearCache(api);

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

        // Clear the cache for this API
        this.clearCache(api);

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

        // Clear the cache for this API
        this.clearCache(api);

        return result;
    }

    resetCache() {
        // This forcefully resets all the cache so we get new data on the next get request
        APIHandler.cacheMap.clear();
    }

    private hasCache(api: API_CALLS, url:string) : boolean {
        // First check if there is a cache for the API
        if (!APIHandler.cacheMap.has(api)) {
            return false;
        }

        const cacheSet = APIHandler.cacheMap.get(api);
        return cacheSet !== undefined && cacheSet.has(url);
    }

    clearCache(api: API_CALLS) {
        APIHandler.cacheMap.delete(api);
    }

    private trackCache(api:API_CALLS, url:string) {
        if (APIHandler.cacheMap.has(api)) {
            const cacheSet = APIHandler.cacheMap.get(api);
            if (cacheSet !== undefined) {
                cacheSet.add(url);
            }
        }
        else {
            const cacheSet = new Set<string>();
            cacheSet.add(url);
            APIHandler.cacheMap.set(api, cacheSet);
        }
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