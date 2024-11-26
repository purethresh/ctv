import { runQuery } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const MEMBER_ID = 'member_id';
const LABEL_ID = 'label_id';
const OWNER_ID = 'owner_id';
const LABEL_NAME = 'labelName';
const LABEL_DESCRIPTION = 'labelDescription';
const CHURCH_ID = 'church_id';
const FOR_SCHEDULE = 'forSchedule';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;
    var query = '';
    var queryParams:any[] = [];

    // Get all the labels for a church
    if (params.has(MEMBER_ID)) {
        query = 'SELECT * FROM dbname.label_member JOIN dbname.labels ON dbname.label_member.label_id = dbname.labels.label_id JOIN dbname.members ON dbname.label_member.member_id = dbname.members.member_id WHERE dbname.label_member.member_id=?';
        queryParams = [params.get(MEMBER_ID)];
    }
    else if (params.has(LABEL_ID)) {
        query = 'SELECT * FROM dbname.label_member JOIN dbname.labels ON dbname.label_member.label_id = dbname.labels.label_id JOIN dbname.members ON dbname.label_member.member_id = dbname.members.member_id WHERE dbname.label_member.label_id=?';
        queryParams = [params.get(LABEL_ID)];
    }
    else if (params.has(OWNER_ID)) {
        query = 'SELECT * FROM dbname.label_member JOIN dbname.labels ON dbname.label_member.label_id = dbname.labels.label_id JOIN dbname.members ON dbname.label_member.member_id = dbname.members.member_id WHERE dbname.label_member.isOwnerOfLabel=?';
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

    const params = req.nextUrl.searchParams;
    var query = '';
    var queryParams:any[] = [];
    if (params.has(LABEL_ID) && params.has(LABEL_NAME) && params.has(CHURCH_ID) && params.has(FOR_SCHEDULE) && params.has(OWNER_ID)) {
        const lblId = params.get(LABEL_ID);
        const lbl = params.get(LABEL_NAME);
        const church = params.get(CHURCH_ID);
        const schedule = params.get(FOR_SCHEDULE);
        const owner_id = params.get(OWNER_ID);
        const desc = params.has(LABEL_DESCRIPTION) ? params.get(LABEL_DESCRIPTION) : '';

        query = "INSERT INTO dbname.labels (label_id, labelName, labelDescription, church_id, forSchedule, owner_id) VALUES (?, ?, ?, ?, ?, ?)";
        queryParams = [lblId, lbl, desc, church, schedule, owner_id];
    }

    if (query.length > 0) {
        try {
            const [dbResults] = await runQuery(query, queryParams);
            // @ts-ignore
            result = {response: 'label created'};;
            resultStatus = {status: 200};
        }
        catch (e:any) {
            result = { error: e.message  };
        }
    }    

    return NextResponse.json(result, resultStatus);
}