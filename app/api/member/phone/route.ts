import { MemberPhoneInfo } from '@/app/lib/MemberPhoneInfo';
import { runQuery } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cleanPhoneNumber, formatPhoneNumber } from '@/app/lib/PhoneUtils';
import { RParams } from '@/app/lib/RParams';

const MEMBER_ID = 'member_id';
const PHONE_ID = 'phone_id';

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

        // Format the phone numbers
        if (dbResults && dbResults.length > 0) {
            for (var i=0; i<dbResults.length; i++) {
                dbResults[i].pNumber = formatPhoneNumber(dbResults[i].pNumber);
            }
        }
        
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
        const params = new RParams();
        await params.useRequest(req);

        // Only update if we have a member_id
        if (params.has(MEMBER_ID) && params.has(PHONE_ID)) {
            const query = 'UPDATE phones SET pNumber=?, isPrimary=? WHERE phone_id=?';
            const queryParams = [ cleanPhoneNumber(params.get('pNumber')), params.get('isPrimary'), params.get(PHONE_ID)];
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
        const params = new RParams();
        await params.useRequest(req);

        // Only update if we have a member_id
        if (params.has(MEMBER_ID) && params.has(PHONE_ID)) {
            const query = 'INSERT INTO phones (phone_id, member_id, pNumber, isPrimary) VALUES (?, ?, ?, ?)';
            const queryParams = [ params.get(PHONE_ID), params.get(MEMBER_ID), cleanPhoneNumber(params.get('pNumber')), params.get('isPrimary')];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}