import { runQuery } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const ROOT_ID = 'root_id';
const MEMBER_ID = 'member_id';

export async function GET(req: NextRequest) {
    var result = {isAdmin: false};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;
    var query = '';
    var queryParams:any[] = [];

    try {

        if (params.has(ROOT_ID) && params.has(MEMBER_ID)) {
            query = "SELECT * FROM labels JOIN label_member ON labels.label_id = label_member.label_id WHERE labels.owner_id=? AND labels.labelName=? AND label_member.member_id=?";
            queryParams = [params.get(ROOT_ID), 'church-member-admin', params.get(MEMBER_ID)];

            const [dbResults] = await runQuery(query, queryParams);

            if (dbResults.length > 0) {
                result.isAdmin = true;
                resultStatus = {status: 200};
            }

        }            
    }
    catch (e:any) {
        // @ts-ignore
        result = { error: e.message  };
    }


    return NextResponse.json(result, resultStatus);
}