import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getStartOfPreviousMonth, getEndOfNextMonth } from '@/app/lib/dateUtils';

const CHURCH_ID = 'church_id';
const YEAR = 'year';
const MONTH = 'month';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // At min, we need Year, and Month. Day is optional
    if (params.has(CHURCH_ID) && params.has(YEAR) && params.has(MONTH)) {
        try {
            const currentTime = new Date(`${params.get(YEAR)}-${params.get(MONTH)}-01`);

            // Get Start and End
            const startTime = getStartOfPreviousMonth(currentTime);
            const endTime = getEndOfNextMonth(currentTime);

            // Now do the query
            const dbQuery = 'SELECT * FROM dbname.schedule JOIN dbname.service on dbname.schedule.service_id = dbname.service.service_id where dbname.schedule.church_id=? AND dbname.service.serviceTime>=? AND dbname.service.serviceTime<?';
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

