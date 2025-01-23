import { useEffect, useState } from 'react';
import { MinMemberInfo } from '../lib/MinMemberInfo';
import { InputLabel, Select, MenuItem, IconButton, Box, Typography, Stack } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { API_CALLS, APIHandler } from '../lib/APIHanlder';

export default function SAllMemberSelect(props:SAllMemberSelectProp) {
    let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);
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
    
    const getAllMembers = async () => {
        const apiHandler = new APIHandler();
        const useFilter = props.useFilter ? props.phoneFilter : false;
        const phoneFilter = props.phoneFilter || '';
        const params = { church_id: props.churchId, useFilter:useFilter ? "true" : "false", phoneFilter:phoneFilter };
        if (useFilter) {
            // @ts-ignore
            params.phoneFilter = props.phoneFilter;
        }
        var rs = [];
        
        if (!useFilter || (useFilter && phoneFilter.length > 0) ) {
            const result = await apiHandler.getData(API_CALLS.member, params, true);
            rs = await result.json();
        }
        
        const mList = [];
        for(var i=0; i<rs.length; i++) {
            mList.push(new MinMemberInfo(rs[i]));
        }

        // Sort the list
        mList.sort((a, b) => {
            var result = a.first.localeCompare(b.first);
            if (result === 0) {
                result = a.last.localeCompare(b.last);
            }
            return result;
        });
        setMemberList(mList);
    }

    useEffect(() => {
        const originalSetup = async () => {
            setSelectedMember(props.defaultMemberId || '');

            if (props.churchId) {
                await getAllMembers();
            }

            if (props.isVisible) {
                setIsVisible(true);
            }
        }
        
        originalSetup();
    }, [props.churchId, props.isVisible, props.updateNumber, props.phoneFilter]);    

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