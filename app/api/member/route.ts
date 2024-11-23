import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const USER_SUB_ID = 'sub';
const CHURCH_ID = 'church_id';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;
    var query = '';
    var queryParams:any[] = [];

    // Look for member based on sub info
    if (params.has(USER_SUB_ID)) {
        query = 'SELECT * FROM members WHERE sub = ?';
        queryParams = [params.get(USER_SUB_ID)];
    }
    else if (params.has(CHURCH_ID)) {
        // Get all tne members for a church
        query = 'SELECT members.member_id, members.first, members.last FROM dbname.members JOIN dbname.church_member ON dbname.members.member_id = dbname.church_member.member_id where dbname.church_member.church_id=?';
        queryParams = [params.get(CHURCH_ID)];
    }

    try {            
        const [dbResults] = await runQuery(query, queryParams);
        if (params.has(USER_SUB_ID)) {
            if (dbResults.length > 0) {
                result = dbResults[0];                
            }
        }
        else {
            result = dbResults;
        }
        resultStatus = {status: 200};
    }
    catch (e:any) {
        result = { error: e.message  };
    }


    return NextResponse.json(result, resultStatus);
}