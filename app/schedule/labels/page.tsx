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

  const loadLablesForMember = async(cId:string, memberId:string) => {
    if (cId.length > 0) {
      const allLabels = new ChurchLabels();
      await allLabels.fetchAllLabels(cId);

      await allLabels.fetchMemberLabels(memberId);
      const memberLabels = allLabels.getMemberLabels();

      setMemberLabels(memberLabels);
    }
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
    <div>My Labels</div>
      {memberLabels.map((item, index) => (
        <SLabel key={index} labelInfo={item} compact={true} />
      ))}
    <div>My Owned Labes</div>
    
    </>
  );




}