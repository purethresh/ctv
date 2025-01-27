import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { SMemberChipProps } from "../props/SMemberChipProps";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import DeleteIcon from '@mui/icons-material/Delete';

export default function SMemberChip(props:SMemberChipProps) {
    let [memberName, setMemberName] = useState<string>('');
    let [memberId, setMemberId] = useState<string>('');
    let [showRemove, setShowRemove] = useState<boolean>(false);

    const onRemove = () => {
        if (props.onRemove) {
            props.onRemove(memberId);
        }
    }

    const setup = () => {
        const mInfo = props.memberInfo || new MinMemberInfo({});
        setMemberId(mInfo.member_id);

        var name = mInfo.first;
        if (mInfo.last.length) {
            name += ' ' + mInfo.last;
        }
        setMemberName(name);
        setShowRemove(props.onRemove !== undefined);
    }


    useEffect(() => {
        setup();
    }, [props.memberInfo]);

    return (
        <Box bgcolor='secondary.main' sx={{display:'inline-flex', margin:'5px', paddingLeft:'10px', paddingRight:'10px', paddingTop:'5px', paddingBottom:'5px', borderRadius:'15px'}}>
            <Typography variant='button' color="secondary.contrastText">{memberName}</Typography>
            <IconButton aria-label="remove" onClick={onRemove} sx={{display: showRemove ? 'inline' : 'none', height:'24px', marginTop:'-12px'}}>
                <DeleteIcon color="primary"/>
            </IconButton>
        </Box>
    );



}