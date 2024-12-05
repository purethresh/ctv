import { MemberPhoneInfo } from '@/app/lib/MemberPhoneInfo';
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
        query = 'SELECT * FROM phones WHERE member_id = ? ORDER BY phones.isPrimary DESC';
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
        const mInfo = new MemberPhoneInfo(data);

        // Only update if we have a member_id
        if (mInfo.phone_id.length > 0) {
            const query = 'UPDATE phones SET pNumber=?, isPrimary=? WHERE phone_id=?';
            const queryParams = [mInfo.pNumber, mInfo.isPrimary, mInfo.phone_id];
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
        const mInfo = new MemberPhoneInfo(data);

        // Only update if we have a member_id
        if (mInfo.phone_id.length > 0) {
            const query = 'INSERT INTO phones (phone_id, member_id, pNumber, isPrimary) VALUES (?, ?, ?, ?)';
            const queryParams = [mInfo.phone_id, mInfo.member_id, mInfo.pNumber, mInfo.isPrimary];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}