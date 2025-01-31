import { RParams } from '@/app/lib/RParams';
import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const CHRUCH_ID = 'church_id';
const LABEL_NAME = 'labelName';
const LABEL_DESCRIPTION = 'labelDescription';
const CHURCH_ID = 'church_id';
const FOR_SCHEDULE = 'forSchedule';
const SCHEDULE_GROUP = 'scheduleGroup';
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

export async function PUT(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = new RParams();
    await params.useRequest(req);
    var query = '';
    var queryParams:any[] = [];
    if (params.has(LABEL_ID) && params.has(LABEL_NAME) && params.has(CHURCH_ID) && params.has(FOR_SCHEDULE) && params.has(OWNER_ID) && params.has(SCHEDULE_GROUP)) {
        const lblId = params.get(LABEL_ID);
        const lbl = params.get(LABEL_NAME);
        const church = params.get(CHURCH_ID);
        const schedule = params.get(FOR_SCHEDULE);
        const scheduleGroup = params.get(SCHEDULE_GROUP);
        const owner_id = params.get(OWNER_ID);
        const desc = params.has(LABEL_DESCRIPTION) ? params.get(LABEL_DESCRIPTION) : '';

        query = "INSERT INTO labels (label_id, labelName, labelDescription, church_id, forSchedule, scheduleGroup, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        queryParams = [lblId, lbl, desc, church, schedule, scheduleGroup, owner_id];
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

export async function POST(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = new RParams();
    await params.useRequest(req);
    var queryParams:any[] = [];
    if (params.has(LABEL_ID) && params.has(LABEL_NAME) && params.has(CHURCH_ID) && params.has(FOR_SCHEDULE) && params.has(SCHEDULE_GROUP)) {
        const lblId = params.get(LABEL_ID);
        const lbl = params.get(LABEL_NAME);
        const schedule = params.get(FOR_SCHEDULE) ? 'true' : 'false';
        const scheduleGroup = params.get(SCHEDULE_GROUP) ? 'true' : 'false';
        const desc = params.has(LABEL_DESCRIPTION) ? params.get(LABEL_DESCRIPTION) : '';

        const query = 'UPDATE labels SET labelName=?, labelDescription=?, forSchedule=?, scheduleGroup=? WHERE label_id=?';        
        queryParams = [lbl, desc, schedule, scheduleGroup, lblId];

        try {
            const [dbResults] = await runQuery(query, queryParams);
            // @ts-ignore
            result = {response: 'label updated'};;
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

    const params = new RParams();
    await params.useRequest(req);

    // Only process if we have an availability_id
    if (params.has(LABEL_ID)) {
        const query = 'DELETE FROM labels WHERE label_id = ?';
        const queryParams = [params.get(LABEL_ID)];

        await runQuery(query, queryParams);
        // @ts-ignore
        result = {response: 'member removed from label'};
        resultStatus = {status: 200};
    }

    return NextResponse.json(result, resultStatus);
}