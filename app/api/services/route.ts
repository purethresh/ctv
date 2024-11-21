import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const CHURCH_ID = 'church_id';
const YEAR = 'year';
const MONTH = 'month';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    if (params.has(CHURCH_ID) && params.has(YEAR) && params.has(MONTH)) {
        try {
            const currentTime = new Date(`${params.get(YEAR)}-${params.get(MONTH)}-01`);
            const nextMonth = new Date(currentTime);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            const dbQuery = 'SELECT * FROM dbname.service WHERE church_id=? AND serviceTime>=? AND serviceTime<?';
            const [dbResults] = await runQuery(dbQuery, [params.get(CHURCH_ID), currentTime.getTime(), nextMonth.getTime()]);

            result = dbResults;
            resultStatus = {status: 200};
        }
        catch (e:any) {
            result = { error: e.message  };
        }
    }
    
    return NextResponse.json(result, resultStatus);
}