import { useEffect, useState } from 'react';
import { MinMemberInfo } from '../lib/MinMemberInfo';
import { InputLabel, Select, MenuItem, IconButton, Box } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function SAllMemberSelect(props:SAllMemberSelectProp) {
    let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);
    let [selectedMember, setSelectedMember] = useState<string>('');
    let [isVisible, setIsVisible] = useState<boolean>(false);

    const handleChange = (event: SelectChangeEvent) => {
        const memberId = event.target.value as string;
        setSelectedMember(memberId);
        if (props.onClick) {
            props.onClick(memberId);
        }
    };   
    
    const getAllMembers = async () => {
        const result = await fetch(`/api/member?church_id=${props.churchId}`);
        var rs = await result.json();

        const mList = [];
        for(var i=0; i<rs.length; i++) {
            mList.push(new MinMemberInfo(rs[i]));
        }
        setMemberList(mList);
    }

    useEffect(() => {
        const originalSetup = async () => {
            if (props.defaultMemberId) {
                setSelectedMember(props.defaultMemberId);
            }

            if (props.churchId) {
                await getAllMembers();
            }

            if (props.isVisible) {
                setIsVisible(true);
            }
        }
        
        originalSetup();
    }, [props.churchId, props.isVisible]);    

    return (
      <Box style={{display:isVisible ? 'block' : 'none'}}>
      <InputLabel id="all-member-select-label">All Church Members</InputLabel>
        <Select
            labelId="all-member-select-label"
            id="all-member-select"
            onChange={handleChange}
            value={memberList.length > 0 ? selectedMember : ''}
            defaultValue=''
        >
            {memberList.map((item, index) => (
                <MenuItem key={item.member_id} value={item.member_id}>{item.first + " " + item.last}</MenuItem>
            ))}                        
        </Select>
      </Box>
    );



}