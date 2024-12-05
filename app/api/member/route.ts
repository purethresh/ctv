import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { MinMemberInfo } from '../../lib/MinMemberInfo';

const USER_SUB_ID = 'sub';
const CHURCH_ID = 'church_id';
const LABEL_ID = 'label_id';
const MEMBER_ID = 'member_id';

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
    else if (params.has(LABEL_ID)) {
        // Get all tne members for a label
        query = 'SELECT members.member_id, members.first, members.last FROM dbname.members JOIN dbname.label_member ON dbname.members.member_id = dbname.label_member.member_id where dbname.label_member.label_id=?';
        queryParams = [params.get(LABEL_ID), params.get(CHURCH_ID)];
    }
    else if (params.has(CHURCH_ID)) {
        // Get all tne members for a church
        query = 'SELECT members.member_id, members.first, members.last FROM dbname.members JOIN dbname.church_member ON dbname.members.member_id = dbname.church_member.member_id where dbname.church_member.church_id=?';
        queryParams = [params.get(CHURCH_ID)];
    }
    else if (params.has(MEMBER_ID)) {
        // Get info on a specific member
        query = "SELECT * FROM members WHERE member_id = ?";
        queryParams = [params.get(MEMBER_ID)];
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

export async function POST(req: NextRequest) {
    console.log('INSIDE POST');

    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const data = await req.json();
        const mInfo = new MinMemberInfo(data);

        // Only update if we have a member_id
        if (mInfo.member_id.length > 0) {
            const query = 'UPDATE members SET first=?, last=?, notes=? WHERE member_id=?';
            const queryParams = [mInfo.first, mInfo.last, mInfo.notes, mInfo.member_id];
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
    console.log('INSIDE POST');

    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const data = await req.json();
        const mInfo = new MinMemberInfo(data);

        // Only update if we have a member_id
        if (mInfo.member_id.length > 0) {
            const query = 'INSERT INTO members (member_id, first, last, notes) VALUES (?, ?, ?, ?)';
            const queryParams = [mInfo.member_id, mInfo.first, mInfo.last, mInfo.notes];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}