import { useEffect, useState } from 'react';
import { MinMemberInfo } from '../lib/MinMemberInfo';
import { InputLabel, Select, MenuItem, Button, IconButton } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function SAllMemberSelect(props:SAllMemberSelectProp) {
    let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);
    let [selectedMember, setSelectedMember] = useState<string>('');

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedMember(event.target.value as string);
    };   
    
    const addPerson = async () => {
        if (props.onClick) {
            props.onClick(selectedMember);
        }
    }

    const getAllMembers = async () => {
        const result = await fetch(`/api/member?church_id=${props.churchId}`, { cache: 'force-cache' });
        var rs = await result.json();

        const mList = [];
        for(var i=0; i<rs.length; i++) {
            mList.push(new MinMemberInfo(rs[i]));
        }
        setMemberList(mList);
    }

    useEffect(() => {
        const originalSetup = async () => {
            if (props.churchId) {
                await getAllMembers();
            }
        }
        
        originalSetup();
    }, [props.churchId]);    

    return (
      <>
      <InputLabel id="all-member-select-label">All Church Members</InputLabel>
        <Select
          labelId="all-member-select-label"
          id="all-member-select"
          value={selectedMember}
          label="All Members"
          onChange={handleChange}
        >
            {memberList.map((item, index) => (
                <MenuItem key={item.member_id} value={item.member_id}>{item.first + " " + item.last}</MenuItem>
            ))}                        
        </Select>
        <IconButton onClick={addPerson}>
            <PersonAddIcon />
        </IconButton>
      </>
    );



}