import { MemberAddressInfo } from '@/app/lib/MemberAddressInfo';
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

export async function POST(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const data = await req.json();
        const mInfo = new MemberAddressInfo(data);

        // Only update if we have a member_id
        if (mInfo.address_id.length > 0) {
            const query = 'UPDATE addresses SET address1=?, address2=?, city=?, state=?, zip=? WHERE address_id=?';
            const queryParams = [mInfo.address1, mInfo.address2, mInfo.city, mInfo.state, mInfo.zip, mInfo.address_id];
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
        const mInfo = new MemberAddressInfo(data);

        // Only update if we have a member_id
        if (mInfo.member_id.length > 0) {
            const query = 'INSERT INTO addresses (address_id, address1, address2, city, state, zip) VALUES (?, ?, ?, ?, ?, ?)';
            const queryParams = [mInfo.address_id, mInfo.address1, mInfo.address2, mInfo.city, mInfo.state, mInfo.zip];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}