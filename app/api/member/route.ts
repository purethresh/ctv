import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const USER_SUB_ID = 'sub';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // Look for member based on sub info
    if (params.has(USER_SUB_ID)) {
        try {
            const [dbResults] = await runQuery('SELECT * FROM members WHERE sub = ?', [params.get(USER_SUB_ID)]);
            if (dbResults.length > 0) {
                result = dbResults[0];
                resultStatus = {status: 200};
            }
        }
        catch (e:any) {
            result = { error: e.message  };
        }
    }

    return NextResponse.json(result, resultStatus);
}