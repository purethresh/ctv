import { runQuery } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const SERVICE_ID = 'service_id';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // Get all the labels for a church
    if (params.has(SERVICE_ID)) {
        try {

            const query = 'SELECT * FROM dbname.schedule JOIN dbname.members on dbname.schedule.member_id = dbname.members.member_id WHERE dbname.schedule.service_id=?'

            const [dbResults] = await runQuery(query, [params.get(SERVICE_ID)]);
            result = dbResults;
            resultStatus = {status: 200};
        }
        catch (e:any) {
            result = { error: e.message  };
        }
    }

    return NextResponse.json(result, resultStatus);
}