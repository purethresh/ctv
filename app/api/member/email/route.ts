import { MemberEmailInfo } from '@/app/lib/MemberEmailInfo';
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
        query = 'SELECT * FROM emails WHERE member_id = ? ORDER BY emails.isPrimary DESC';
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

export async function POST(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const data = await req.json();
        const mInfo = new MemberEmailInfo(data);

        // Only update if we have a member_id
        if (mInfo.email_id.length > 0) {
            const query = 'UPDATE emails SET email=?, isPrimary=? WHERE email_id=?';
            const queryParams = [mInfo.email, mInfo.isPrimary, mInfo.email_id];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}

export async function PUT(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const data = await req.json();
        const mInfo = new MemberEmailInfo(data);

        // Only update if we have a member_id
        if (mInfo.email_id.length > 0) {
            const query = 'INSERT INTO emails (email_id, member_id, email, isPrimary) VALUES (?, ?, ?, ?)';
            const queryParams = [mInfo.email_id, mInfo.member_id, mInfo.email, mInfo.isPrimary];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}