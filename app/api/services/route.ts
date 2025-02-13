import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { ServiceInfo } from '../../lib/ServiceInfo';

const CHURCH_ID = 'church_id';
const YEAR = 'year';
const MONTH = 'month';
const DAY = 'day';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // At min, we need Year, and Month. Day is optional
    if (params.has(CHURCH_ID) && params.has(YEAR) && params.has(MONTH)) {
        try {
            const currentDay = params.has(DAY) ? params.get(DAY) : '01';
            const currentTime = new Date(`${params.get(YEAR)}-${params.get(MONTH)}-${currentDay}`);

            // Find the end time
            var endTime = new Date(currentTime);
            if (params.has(DAY)) {
                // Move to the next day
                endTime.setDate(endTime.getDate() + 1);
            }
            else {
                // Move to the next month
                endTime.setMonth(endTime.getMonth() + 1);
            }

            // Now do the query
            const dbQuery = 'SELECT * FROM service WHERE church_id=? AND serviceTime>=? AND serviceTime<?';
            const [dbResults] = await runQuery(dbQuery, [params.get(CHURCH_ID), currentTime.getTime(), endTime.getTime()]);

            result = dbResults;
            resultStatus = {status: 200};
        }
        catch (e:any) {
            result = { error: e.message  };
        }
    }
    
    return NextResponse.json(result, resultStatus);
}

export async function POST(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const data = await req.json();
        const sInfo = new ServiceInfo(data);

        // Only update if we have a service_id
        if (sInfo.service_id.length > 0) {
            const query = 'UPDATE service SET church_id=?, serviceTime=?, name=?, info=? WHERE service_id=?';
            const queryParams = [sInfo.church_id, sInfo.serviceTime, sInfo.name, sInfo.info, sInfo.service_id];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}

export async function PUT(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const data = await req.json();
        const sInfo = new ServiceInfo(data);

        // Only update if we have a service_id
        if (sInfo.service_id.length > 0) {
            const query = 'INSERT INTO service (service_id, church_id, serviceTime, name, info) VALUES (?, ?, ?, ?, ?)';
            const queryParams = [sInfo.service_id, sInfo.church_id, sInfo.serviceTime, sInfo.name, sInfo.info];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}