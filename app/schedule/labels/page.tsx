"use client"

import React, { useState, useEffect } from 'react';
import UserInfo from '@/app/lib/UserInfo';
import ChurchLabels from '@/app/lib/ChurchLabels';
import LabelInfo from '@/app/lib/LabelInfo';
import SLabel from '@/app/components/SLabel';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

export default function LabelPage() {
  let [memberLabels, setMemberLabels] = useState<LabelInfo[]>([]);
  let [showMemberList, setShowMemberList] = useState<boolean>(false);
  let [memberList, setMemberList] = useState<any[]>([]);
  let [selectedMember, setSelectedMember] = useState<string>('');
  let [churchId, setChurchId] = useState<string>('');

  // TODO JLS -- HERE
  // Show My Lables (as member)
  // Show My Labels (as Owner)
  // Show selected label, where we can edit the label

  const getChurchMembers = async(churchId:string) => {
      const res = await fetch('/api/member?church_id=' + churchId, { cache: 'force-cache' });
      const data = await res.json();

      if (data) {
        setMemberList(data);
      }
  }

  const loadLablesForMember = async(cId:string, memberId:string) => {
    if (cId.length > 0) {
      const allLabels = new ChurchLabels();
      await allLabels.fetchAllLabels(cId);

      await allLabels.fetchMemberLabels(memberId);
      const memberLabels = allLabels.getMemberLabels();
      const isAdmin = allLabels.isAdministrator();

      if (isAdmin) {
        getChurchMembers(cId);
      }

      setMemberLabels(memberLabels);
      setShowMemberList(isAdmin);      
    }
  }

  const handleMemberChange = async (event: SelectChangeEvent) => {
    const memberId = event.target.value as string
    setSelectedMember(memberId);

    await loadLablesForMember(churchId, memberId);
  }

  useEffect(() => {

    const getUserInfo = async() => {
      const uInfo = new UserInfo();
      await uInfo.loadMemberInfo();
      setChurchId(uInfo.church_id);

      await loadLablesForMember(uInfo.church_id, uInfo.member_id);
    }

    getUserInfo();
  }, []);  

  return (
    <>
      <FormControl style={{display:showMemberList ? 'block' : 'none'}}>
        <InputLabel id="member-select">Church Members</InputLabel>
        <Select labelId="member-select" value={selectedMember} onChange={handleMemberChange}>
          {memberList.map((item, index) => (
            <MenuItem value={item.member_id} key={index}>{item.first + ' ' + item.last}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {memberLabels.map((item, index) => (
        <SLabel key={index} labelInfo={item} />
      ))}
    </>
  );




}