import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { runQuery } from '../../lib/db';

const MEMBER_ID:string = 'member_id';
const CHURCH_ID:string = 'church_id';
const MIN_DATE:string = 'min';
const MAX_DATE:string = 'max';
const AVAILABLE_ID:string = 'availability_id';

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
    else if (params.has(CHURCH_ID) && params.has(MIN_DATE) && params.has(MAX_DATE)) {
        try {
            const query = 'SELECT * FROM dbname.availability JOIN dbname.church_member ON dbname.availability.member_id = dbname.church_member.member_id WHERE dbname.church_member.church_id=? AND availability.blockOutDay>=? AND dbname.availability.blockOutDay<?'
            const queryParams = [params.get(CHURCH_ID), Number(params.get(MIN_DATE)), Number(params.get(MAX_DATE))];

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

export async function DELETE(req:NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // Only process if we have an availability_id
    if (params.has(AVAILABLE_ID)) {
        const query = 'DELETE FROM availability WHERE availability_id = ?';
        const queryParams = [params.get(AVAILABLE_ID)];

        await runQuery(query, queryParams);
        // @ts-ignore
        result = {response: 'blockout date removed'};
        resultStatus = {status: 200};
    }

    return NextResponse.json(result, resultStatus);
}

export async function POST(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const data = await req.json();
    if (data.availability_id !== undefined && data.member_id !== undefined && data.blockOutDay !== undefined) {
        const query = 'INSERT INTO availability (availability_id, member_id, blockOutDay) VALUES (?, ?, ?)';
        const queryParams = [data.availability_id, data.member_id, data.blockOutDay];

        try {
            await runQuery(query, queryParams);
            // @ts-ignore
            result = {response: 'blockout date added'};
            resultStatus = {status: 200};
        }
        catch (e:any) {
            result = { error: e.message  };
        }
    }

    return NextResponse.json(result, resultStatus);
}