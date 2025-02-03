"use server"

import { runQuery } from '../../lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import {cleanPhoneNumber} from '../../lib/PhoneUtils';
import { v4 } from 'uuid';
import { RParams } from '@/app/lib/RParams';
import { Amplify } from 'aws-amplify';

const USER_SUB_ID = 'sub';
const CHURCH_ID = 'church_id';
const LABEL_ID = 'label_id';
const MEMBER_ID = 'member_id';
const USE_FILTER = 'useFilter';
const PHONE_FILTER = 'phoneFilter';

export async function GET(req: NextRequest) {
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    const params = req.nextUrl.searchParams;
    const useFilter = params.get(USE_FILTER) === 'true';
    var query = '';
    var queryParams:any[] = [];
    
    // Look for member based on sub info
    if (params.has(USER_SUB_ID)) {
        query = 'Select * from ctv.members JOIN ctv.church_member ON members.member_id=church_member.member_id JOIN ctv.churches on church_member.church_id = churches.church_id WHERE members.sub=?';
        queryParams = [params.get(USER_SUB_ID)];
    }
    else if (params.has(LABEL_ID)) {
        // Get all the members for a label
        query = 'SELECT members.member_id, members.first, members.last, members.gender FROM members JOIN label_member ON members.member_id = label_member.member_id where label_member.label_id=?';
        queryParams = [params.get(LABEL_ID), params.get(CHURCH_ID)];
    }
    else if (params.has(CHURCH_ID) && useFilter && params.has(PHONE_FILTER)) {
        const pNumber = cleanPhoneNumber(params.get(PHONE_FILTER) || '');
        // Get all tne members for a church
        query = "SELECT * FROM members JOIN church_member ON members.member_id = church_member.member_id JOIN phones ON members.member_id = phones.member_id WHERE members.sub = '' AND church_member.church_id=? AND phones.pNumber=?";
        queryParams = [params.get(CHURCH_ID), pNumber];
    }
    else if (params.has(CHURCH_ID) && !useFilter) {
        // Get all tne members for a church
        query = 'SELECT members.member_id, members.first, members.last, members.gender FROM members JOIN church_member ON members.member_id = church_member.member_id where church_member.church_id=?';
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
    var result = {error: 'nothing happened'};
    var resultStatus = {status: 500};

    try {
        const params = new RParams();
        await params.useRequest(req);

        // Only update if we have a member_id
        if (params.has(MEMBER_ID)) {
            const query = 'UPDATE members SET first=?, last=?, notes=?, gender=? WHERE member_id=?';
            const queryParams = [params.get('first'), params.get('last'), params.get('notes'), params.get('gender'), params.get('member_id')];
            const [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        console.log('In Error');
        console.log(e);
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
        if (params.has(CHURCH_ID) && params.has(MEMBER_ID)) {
            // Insert user
            var query = 'INSERT INTO members (member_id, first, last, notes, gender) VALUES (?, ?, ?, ?, ?)';
            var queryParams = [params.get(MEMBER_ID), params.get('first'), params.get('last'), params.get('notes'), params.get('gender')];
            var [dbResults] = await runQuery(query, queryParams);
            result = dbResults;

            // Add the member to the church
            query = 'INSERT INTO church_member (church_member_id, church_id, member_id) VALUES (?, ?, ?)';
            queryParams = [v4(), params.get(CHURCH_ID), params.get(MEMBER_ID)];
            var [dbResults] = await runQuery(query, queryParams);
            result = dbResults;
            resultStatus = {status: 200};
        }
    }
    catch(e) {
        
    }

    return NextResponse.json(result, resultStatus);
}