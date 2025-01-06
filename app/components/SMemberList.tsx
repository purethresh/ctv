import { useEffect, useState } from 'react';
import { SMemberListProp } from "../props/SMemberListProp";
import { MinMemberInfo } from '../lib/MinMemberInfo';
import { LabelInfo } from '../lib/LabelInfo';
import SMemberChip from './SMemberChip';
import { Box, Paper, Typography } from '@mui/material';

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
        <Box sx={{paddingBottom:'10px', paddingTop:'10px'}}>
            <Paper elevation={2}>
                <Box bgcolor='secondary.main' sx={{paddingLeft:'10px', paddingTop:'5px', paddingBottom:'5px'}}>
                    <Typography variant='h6' color='secondary.contrastText'>{title} {labelName}</Typography>
                </Box>
                {mList.map((item, index) => (
                    <SMemberChip key={item.member_id} memberInfo={item} onRemove={removeMember}/>
                ))}
            </Paper>
        </Box>
    );

}
