// import { SLabelGroupProps } from "../props/SLabelGroupProps";
// import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import { Chip } from "@mui/material";
// import LabelInfo from "../lib/LabelInfo";
// import SLabel from "./SLabel";

import { SMemberListProp } from "../props/SMemberListProp";
import { MinMemberInfo } from '../lib/MinMemberInfo';

export default function SMemberList( props:SMemberListProp) {
    let [title, setTitle] = useState<string>('');
    let [labelName, setLabelName] = useState<string>('');
    let [mList, setMList] = useState<MinMemberInfo[]>([]);

    useEffect(() => {
        const updateShowElements = async () => {
            
            setTitle(props.title || '');
            setLabelName(props.labelInfo?.labelName || '');
            setMList(props.memberList || []);
        }
        
        updateShowElements();
    }, [props.labelInfo, props.memberList, props.title]);

    return (
        <>
            <div>{title} {labelName}</div>
            {mList.map((item, index) => (
                <Chip key={item.member_id} label={item.first + " " + item.last} />
            ))}
        </>
    );

}
