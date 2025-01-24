import { runQuery } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { v4 } from 'uuid';

const MEMBER_ID = 'member_id';
const LABEL_ID = 'label_id';
const OWNER_ID = 'owner_id';
const IS_OWNER = 'owner';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;
    var query = '';
    var queryParams:any[] = [];

    // Get all the labels for a church
    if (params.has(MEMBER_ID)) {
        query = 'SELECT * FROM label_member JOIN labels ON label_member.label_id = labels.label_id JOIN members ON label_member.member_id = members.member_id WHERE label_member.member_id=?';
        queryParams = [params.get(MEMBER_ID)];
    }
    else if (params.has(LABEL_ID)) {
        query = 'SELECT * FROM label_member JOIN labels ON label_member.label_id = labels.label_id JOIN members ON label_member.member_id = members.member_id WHERE label_member.label_id=?';
        queryParams = [params.get(LABEL_ID)];
    }
    else if (params.has(OWNER_ID)) {
        query = 'SELECT * FROM label_member JOIN labels ON label_member.label_id = labels.label_id JOIN members ON label_member.member_id = members.member_id WHERE label_member.isOwnerOfLabel=?';
        queryParams = ['true'];
    }


    if (query.length > 0) {
        try {
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


export async function POST(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const data = await req.json();
    var query = '';
    var queryParams:any[] = [];

    if (data[LABEL_ID] !== undefined && data[MEMBER_ID] !== undefined) {
        var isOwner:string = data[IS_OWNER] === 'true' ? 'true' : 'false';
        const lableMemberId = v4();

        query = "INSERT INTO label_member (label_member_id, label_id, member_id, isOwnerOfLabel) VALUES (?, ?, ?, ?)";
        queryParams = [lableMemberId, data[LABEL_ID], data[MEMBER_ID], isOwner];
    }

    if (query.length > 0) {
        try {
            const [dbResults] = await runQuery(query, queryParams);
            // @ts-ignore
            result = {response: 'member added to label'};
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

    const data = await req.json();

    // Only process if we have an availability_id
    if (data[LABEL_ID] !== undefined && data[MEMBER_ID] !== undefined) {
        const query = 'DELETE FROM label_member WHERE label_id = ? AND member_id = ?';
        const queryParams = [data[LABEL_ID], data[MEMBER_ID]];

        await runQuery(query, queryParams);
        // @ts-ignore
        result = {response: 'member removed from label'};
        resultStatus = {status: 200};
    }

    return NextResponse.json(result, resultStatus);
}
