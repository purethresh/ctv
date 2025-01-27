import { MemberPhoneInfo } from '@/app/lib/MemberPhoneInfo';
import { runQuery } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cleanPhoneNumber, formatPhoneNumber } from '@/app/lib/PhoneUtils';
import { RParams } from '@/app/lib/RParams';

const MEMBER_ID = 'member_id';
const SUB = 'sub';

export async function PUT(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const params = new RParams();
        await params.useRequest(req);

        if (params.has(MEMBER_ID) && params.has(SUB)) {
            const query = 'UPDATE members SET sub = ? WHERE member_id = ?';
            const queryParams = [params.get(SUB), params.get(MEMBER_ID)];
            const [dbResults] = await runQuery(query, queryParams);
            // @ts-ignore
            result = {response: 'member linked'};
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}

export async function DELETE(req:NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const params = new RParams();
        await params.useRequest(req);

        if (params.has(MEMBER_ID)) {
            const query = "UPDATE members SET sub = '' WHERE member_id = ?";
            const queryParams = [params.get(MEMBER_ID)];
            const [dbResults] = await runQuery(query, queryParams);
            // @ts-ignore
            result = {response: 'member unlinked'};
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}