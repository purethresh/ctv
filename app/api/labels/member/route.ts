import { runQuery } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const MEMBER_ID = 'member_id';
const LABEL_ID = 'label_id';
const OWNER_ID = 'owner_id';

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