import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getStartOfPreviousMonth, getEndOfNextMonth } from '@/app/lib/DateUtils';
import { v4 } from 'uuid';
import { RParams } from '@/app/lib/RParams';

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
            const dbQuery = 'SELECT * FROM schedule JOIN members on schedule.member_id = members.member_id WHERE schedule.service_id=?';
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
            const dbQuery = 'SELECT * FROM schedule JOIN service on schedule.service_id = service.service_id WHERE schedule.church_id=? AND service.serviceTime>=? AND service.serviceTime<?';
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

export async function PUT(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const params = new RParams();
        await params.useRequest(req);

        if (params.has(CHURCH_ID) && params.has(SERVICE_ID) && params.has(LABEL_ID) && params.has(MEMBER_ID)) {
            const query = 'INSERT INTO schedule (schedule_id, church_id, service_id, label_id, member_id) VALUES (?, ?, ?, ?, ?)';
            const sid = v4();
            const queryParams = [sid, params.get(CHURCH_ID), params.get(SERVICE_ID), params.get(LABEL_ID), params.get(MEMBER_ID)];
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

    const params = new RParams();
    await params.useRequest(req);

    // Only process if we have an availability_id
    if (params.has(SERVICE_ID) && params.has(LABEL_ID) && params.has(MEMBER_ID)) {
        const query = 'DELETE FROM schedule WHERE service_id = ? AND label_id = ? AND member_id = ?';
        const queryParams = [params.get(SERVICE_ID), params.get(LABEL_ID), params.get(MEMBER_ID)];

        await runQuery(query, queryParams);
        // @ts-ignore
        result = {response: 'member removed from schedule'};
        resultStatus = {status: 200};
    }

    return NextResponse.json(result, resultStatus);
}
