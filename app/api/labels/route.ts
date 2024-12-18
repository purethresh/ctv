import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const CHRUCH_ID = 'church_id';
const LABEL_NAME = 'labelName';
const LABEL_DESCRIPTION = 'labelDescription';
const CHURCH_ID = 'church_id';
const FOR_SCHEDULE = 'forSchedule';
const LABEL_ID = 'label_id';
const OWNER_ID = 'owner_id';


export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;

    // Get all the labels for a church
    if (params.has(CHRUCH_ID)) {
        try {
            const [dbResults] = await runQuery('SELECT * FROM labels WHERE church_id = ?', [params.get(CHRUCH_ID)]);
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