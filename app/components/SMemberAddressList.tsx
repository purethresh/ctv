import { SMemberInfoProp } from "../props/SMemberInfoProp";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { IAddressInfo } from "../lib/IAddressInfo";

export default function SMemberAddressList(props:SMemberInfoProp) {
    let [memberId, setMemberId] = useState<string>('');
    let [addressList, setAddressList] = useState<IAddressInfo[]>([]);

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
            setAddressList(rs);
        }
    }

    useEffect(() => {
        updateMemberInfo();
    }, [props.memberId, props.isAdmin]); 

// TODO JLS - index should be correct

    return (
        <>
            {addressList.map((aInfo, index) => (
                <Box key={index}>
                    <Typography>
                        {aInfo.address1} <br />
                        {aInfo.address2} <br />
                        {aInfo.city}, {aInfo.state} {aInfo.zip}
                    </Typography>
                </Box>
            ))}        
        </>
    );

}