import UserInfo from "../lib/UserInfo";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

// TODO JLS, probably need to get rid of this
// https://docs.amplify.aws/nextjs/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/
// TODO JLS, these are examples of getting the data through Lambda functions
// But it is slow. So we need to move this to the API Gateway


export async function getMemberInfoBySub(sub:string, uInfo:UserInfo) {
    let client = generateClient<Schema>();
    let mList = await client.models.members.list({filter: {sub: {eq: sub}}});

    if (mList && mList.data.length > 0) {
        uInfo.setMemberInfo(mList.data[0]);
    }
}


export async function getChurchForMember(member_id:string, uInfo:UserInfo) {
    let client = generateClient<Schema>();

    // First get the church member record
    let cmember = await client.models.church_member.list({filter: {member_id: {eq: member_id}}});

    //If we have a church member, then get the church record
    if (cmember && cmember.data.length > 0) {
        let church = await client.models.churches.list({filter: {church_id: {eq: cmember.data[0].church_id}}});

        if (church && church.data.length > 0) {
            uInfo.church_id = church.data[0].church_id;
            uInfo.churchName = church.data[0].churchName;
        }
    }
}