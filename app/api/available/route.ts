import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { runQuery } from '../../lib/db';

const MEMBER_ID:string = 'member_id';
const MIN_DATE:string = 'min';
const MAX_DATE:string = 'max';

export async function GET(req:NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // Look for member based on sub info
    if (params.has(MEMBER_ID) && params.has(MIN_DATE) && params.has(MAX_DATE)) {
        try {
            const query = 'SELECT * FROM availability WHERE member_id = ? AND blockOutDay>=? AND blockOutDay<? ORDER BY blockOutDay DESC';
            const queryParams = [params.get(MEMBER_ID), Number(params.get(MIN_DATE)), Number(params.get(MAX_DATE))];

            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
        catch (e:any) {
            result = { error: e.message  };
        }
    }

    return NextResponse.json(result, resultStatus);
}