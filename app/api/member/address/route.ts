import { runQuery } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const MEMBER_ID = 'member_id';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;
    var query = '';
    var queryParams:any[] = [];

    // Look for member based on sub info
    if (params.has(MEMBER_ID)) {
        query = 'SELECT * FROM addresses WHERE member_id = ?';
        queryParams = [params.get(MEMBER_ID)];
    }

    try {            
        const [dbResults] = await runQuery(query, queryParams);
        result = dbResults;
        resultStatus = {status: 200};
    }
    catch (e:any) {
        result = { error: e.message  };
    }

    return NextResponse.json(result, resultStatus);
}