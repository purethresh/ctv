import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const CHRUCH_ID = 'church_id';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // Get all the labels for a church
    if (params.has(CHRUCH_ID)) {
        try {
            const [dbResults] = await runQuery('SELECT * FROM labels WHERE church_id = ?', [params.get(CHRUCH_ID)]);
            result = dbResults;
            resultStatus = {status: 200};
        }
        catch (e:any) {
            result = { error: e.message  };
        }
    }

    return NextResponse.json(result, resultStatus);
}