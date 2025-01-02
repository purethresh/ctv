import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getStartOfPreviousMonth, getEndOfNextMonth } from '@/app/lib/dateUtils';
import { v4 } from 'uuid';

const CHURCH_ID = 'church_id';
const MEMBER_ID = 'member_id';
const SERVICE_ID = 'service_id';
const LABEL_ID = 'label_id';
const YEAR = 'year';
const MONTH = 'month';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // Either get a specific schedule or all schedules for a month
    if (params.has(SERVICE_ID)) {
        try {
            const dbQuery = 'SELECT * FROM dbname.schedule JOIN dbname.members on dbname.schedule.member_id = dbname.members.member_id WHERE dbname.schedule.service_id=?';
            const [dbResults] = await runQuery(dbQuery, [params.get(SERVICE_ID)]);

            result = dbResults;
            resultStatus = {status: 200};
        }
        catch (e:any) {
            result = { error: e.message  };
        }
    }
    else if (params.has(CHURCH_ID) && params.has(YEAR) && params.has(MONTH)) {
        try {
            const currentTime = new Date(`${params.get(YEAR)}-${params.get(MONTH)}-01`);

            // Get Start and End
            const startTime = getStartOfPreviousMonth(currentTime);
            const endTime = getEndOfNextMonth(currentTime);

            // Now do the query
            const dbQuery = 'SELECT * FROM dbname.schedule JOIN dbname.service on dbname.schedule.service_id = dbname.service.service_id WHERE dbname.schedule.church_id=? AND dbname.service.serviceTime>=? AND dbname.service.serviceTime<?';
            const [dbResults] = await runQuery(dbQuery, [params.get(CHURCH_ID), startTime.getTime(), endTime.getTime()]);

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

        const params = req.nextUrl.searchParams;
        if (data[CHURCH_ID] !== undefined && data[SERVICE_ID] !== undefined && data[LABEL_ID] !== undefined && data[MEMBER_ID] !== undefined) {
            const query = 'INSERT INTO dbname.schedule (schedule_id, church_id, service_id, label_id, member_id) VALUES (?, ?, ?, ?, ?)';
            const queryParams = [v4(), data[CHURCH_ID], data[SERVICE_ID], data[LABEL_ID], data[MEMBER_ID]];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}

export async function DELETE(req:NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;
    // Only process if we have an availability_id
    if (params.has(SERVICE_ID) && params.has(LABEL_ID) && params.has(MEMBER_ID)) {
        const query = 'DELETE FROM dbname.schedule WHERE service_id = ? AND label_id = ? AND member_id = ?';
        const queryParams = [params.get(SERVICE_ID), params.get(LABEL_ID), params.get(MEMBER_ID)];

        await runQuery(query, queryParams);
        // @ts-ignore
        result = {response: 'member removed from schedule'};
        resultStatus = {status: 200};
    }

    return NextResponse.json(result, resultStatus);
}
