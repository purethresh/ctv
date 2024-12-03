import { runQuery } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;
    var query = '';
    var queryParams:any[] = [];

    try {

        // TODO JLS, need admin label id, label name ('church-member-admin'), and member id
        query = "SELECT * FROM dbname.labels JOIN dbname.label_member ON dbname.labels.label_id = dbname.label_member.label_id WHERE dbname.labels.owner_id = 'd5976341-6c6d-460b-b558-1d1bd600647d' AND dbname.labels.labelName='church-member-admin' AND dbname.label_member.member_id = '4f6a6872-9c09-49ab-b122-a72ad5f695e7'";
        const [dbResults] = await runQuery(query, queryParams);
        result = dbResults;
        resultStatus = {status: 200};
    }
    catch (e:any) {
        result = { error: e.message  };
    }


    return NextResponse.json(result, resultStatus);
}