import { useEffect, useState } from 'react';
import { MinMemberInfo } from '../lib/MinMemberInfo';
import { InputLabel, Select, MenuItem, IconButton, Box, Typography, Stack } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { SAllMemberSelectProp } from '../props/SAllMemberSelectProp';

export default function SAllMemberSelect(props:SAllMemberSelectProp) {
    let [memberList, setMemberList] = useState<MinMemberInfo[]>(props.memberList);
    let [selectedMember, setSelectedMember] = useState<string>('');
    let [isVisible, setIsVisible] = useState<boolean>(false);
    let [defaultMemberId, setDefaultMemberId] = useState<string>('');

    const handleChange = (event: SelectChangeEvent) => {
        const memberId = event.target.value as string;

        setSelectedMember(memberId);
        if (props.onClick) {
            props.onClick(memberId);
        }
    };

    useEffect(() => {
        const originalSetup = async () => {
            setSelectedMember(props.defaultMemberId || '');
            setMemberList(props.memberList);

            if (props.isVisible) {
                setIsVisible(true);
            }
        }
        
        originalSetup();
    }, [props.isVisible, props.updateNumber, props.memberList]);

    return (
      <Box style={{display:isVisible ? 'block' : 'none', textAlign:'center'}}>
        <Stack>
            <InputLabel id="all-member-select-label">
                <Typography variant='subtitle1' color='primary.contrastText'>All Church Members</Typography>
            </InputLabel>
            <Select
                labelId="all-member-select-label"
                id="all-member-select"
                onChange={handleChange}
                value={memberList.length > 0 ? selectedMember : ''}
                defaultValue={defaultMemberId}
                sx={{marginBottom: '10px'}}
            >
                {memberList.map((item, index) => (
                    <MenuItem key={item.member_id} value={item.member_id}>{item.first + " " + item.last}</MenuItem>
                ))}                        
            </Select>
        </Stack>
      </Box>
    );



}