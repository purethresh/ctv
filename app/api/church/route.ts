import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { runQuery } from '../../lib/db';

const MEMBER_ID:string = 'member_id';

export async function GET(req:NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // Look for member based on sub info
    if (params.has(MEMBER_ID)) {
        try {
            const [dbResults] = await runQuery('SELECT * FROM dbname.churches JOIN dbname.church_member ON dbname.churches.church_id = dbname.church_member.church_id where dbname.church_member.member_id = ?', [params.get(MEMBER_ID)]);
            if (dbResults.length > 0) {
                result = dbResults[0];
                resultStatus = {status: 200};
            }
        }
        catch (e:any) {
            console.error(e);
            result = { error: e.message  };
        }
    }

    return NextResponse.json(result, resultStatus);
}