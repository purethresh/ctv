import { useEffect, useState } from 'react';
import { Chip } from "@mui/material";
import { SMemberListProp } from "../props/SMemberListProp";
import { MinMemberInfo } from '../lib/MinMemberInfo';
import { LabelInfo } from '../lib/LabelInfo';
import SMemberChip from './SMemberChip';

export default function SMemberList( props:SMemberListProp) {
    let [title, setTitle] = useState<string>('');
    let [labelName, setLabelName] = useState<string>('');
    let [mList, setMList] = useState<MinMemberInfo[]>([]);

    const removeMember = (memberId:string) => {
        if (props.onRemoveMember) {
            props.onRemoveMember(memberId);
        }
    }

    useEffect(() => {
        const updateShowElements = async () => {

            const lblInfo = props.labelInfo || new LabelInfo({});
            const userId = props.userId || '';
            
            setTitle(props.title || '');
            setLabelName(lblInfo.labelName);
            setMList(props.memberList || []);
        }
        
        updateShowElements();
    }, [props.labelInfo, props.memberList, props.title, props.userId]);

    return (
        <>
            <div>{title} {labelName}</div>
            {mList.map((item, index) => (
                <SMemberChip key={item.member_id} memberInfo={item} onRemove={removeMember}/>
            ))}
        </>
    );

}
