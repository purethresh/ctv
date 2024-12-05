import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { IEmailInfo } from "../lib/IEmailInfo";

export default function SMemberEmailList(props:SMemberInfoProp) {
    let [memberId, setMemberId] = useState<string>('');
    let [emailList, setEmailList] = useState<IEmailInfo[]>([]);

    const updateMemberInfo = async() => {
        
        // If no member Id, then we can't do anything
        if (props.memberId === undefined || props.memberId.length <= 0) {
            return
        }

        const mId = props.memberId;
        setMemberId(mId);

        // Get the member info
        const result = await fetch(`/api/member/email?member_id=${mId}`, { cache: 'force-cache' });
        var rs = await result.json();

        if (rs.length > 0) {
            setEmailList(rs);
        }
    }

    useEffect(() => {
        updateMemberInfo();
    }, [props.memberId, props.isAdmin]); 

    return (
        <>
            {emailList.map((eInfo, index) => (
                <Box><Typography>{eInfo.email}</Typography></Box>
            ))}        
        </>
    );

}