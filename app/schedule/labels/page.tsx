"use client"

import React, { useState, useEffect } from 'react';
import UserInfo from '@/app/lib/UserInfo';
import ChurchLabels from '@/app/lib/ChurchLabels';
import LabelInfo from '@/app/lib/LabelInfo';
import SLabel from '@/app/components/SLabel';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function LabelPage() {
  let [memberLabels, setMemberLabels] = useState<LabelInfo[]>([]);
  let [showMemberList, setShowMemberList] = useState<boolean>(false);
  let [memberList, setMemberList] = useState<any[]>([]);
  let [defaultMember, setDefaultMember] = useState<string>('');

  const getChurchMembers = async(churchId:string) => {
      const res = await fetch('/api/member?church_id=' + churchId, { cache: 'force-cache' });
      const data = await res.json();

      if (data) {
        setMemberList(data);
      }
  }

  useEffect(() => {

    const getUserInfo = async() => {
      const uInfo = new UserInfo();
      await uInfo.loadMemberInfo();

      // Get all the labels for the church
      const allLabels = new ChurchLabels();
      await allLabels.fetchAllLabels(uInfo.church_id);

      // Get the labels specific to the viewing member
      await allLabels.fetchMemberLabels(uInfo.member_id);
      const memberLabels = allLabels.getMemberLabels();
      const isAdmin = allLabels.isAdministrator();

      if (isAdmin) {
        getChurchMembers(uInfo.church_id);
      }

      setMemberLabels(memberLabels);
      setShowMemberList(isAdmin);
    }

    getUserInfo();
  }, []);  

  return (
    <>
      <FormControl style={{display:showMemberList ? 'block' : 'none'}}>
        <InputLabel id="member-select">Church Members</InputLabel>
        <Select labelId="member-select" value={defaultMember}>
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