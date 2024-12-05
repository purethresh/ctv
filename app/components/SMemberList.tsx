import { useEffect, useState } from 'react';
import { Chip } from "@mui/material";

import { SMemberListProp } from "../props/SMemberListProp";
import { MinMemberInfo } from '../lib/MinMemberInfo';
import SAllMemberSelect from './SAllMemberSelect';

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
            <SAllMemberSelect churchId={props.labelInfo?.church_id} />
        </>
    );

}
