import { Box, IconButton } from "@mui/material";
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
        <Box sx={{display:'inline-flex', margin:'5px', paddingLeft:'10px', paddingRight:'10px', paddingTop:'5px', paddingBottom:'5px', borderRadius:'15px', backgroundColor:'#f0f0f0'}}>
            {memberName}
            <IconButton aria-label="remove" onClick={onRemove} sx={{display: showRemove ? 'inline' : 'none'}}>
                <DeleteIcon/>
            </IconButton>
        </Box>
    );



}