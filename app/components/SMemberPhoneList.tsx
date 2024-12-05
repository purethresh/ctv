import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { IPhoneInfo } from "../lib/IPhoneInfo";

export default function SMemberPhoneList(props:SMemberInfoProp) {
    let [memberId, setMemberId] = useState<string>('');
    let [phoneList, setPhoneList] = useState<IPhoneInfo[]>([]);

    const updateMemberInfo = async() => {
        
        // If no member Id, then we can't do anything
        if (props.memberId === undefined || props.memberId.length <= 0) {
            return
        }

        const mId = props.memberId;
        setMemberId(mId);

        // Get the member info
        const result = await fetch(`/api/member/phone?member_id=${mId}`, { cache: 'force-cache' });
        var rs = await result.json();

        if (rs.length > 0) {
            setPhoneList(rs);
        }
    }

    useEffect(() => {
        updateMemberInfo();
    }, [props.memberId, props.isAdmin]); 

    return (
        <>
            {phoneList.map((pInfo, index) => (
                <Box><Typography>{pInfo.pNumber}</Typography></Box>
            ))}        
        </>
    );

}