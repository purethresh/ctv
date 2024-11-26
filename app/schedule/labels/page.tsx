"use client"

import React, { useState, useEffect } from 'react';
import UserInfo from '@/app/lib/UserInfo';
import ChurchLabels from '@/app/lib/ChurchLabels';
import LabelInfo from '@/app/lib/LabelInfo';
import SLabelList from '@/app/components/SLabelList';
import SLabelInfo from '@/app/components/SLabelInfo';
import { MinMemberInfo } from '@/app/lib/MinMemberInfo';

export default function LabelPage() {
  let [churchLabels, setChurchLabels] = useState<ChurchLabels>(new ChurchLabels());
  let [memberLabels, setMemberLabels] = useState<LabelInfo[]>([]);
  let [ownerLabels, setOwnerLabels] = useState<LabelInfo[]>([]);
  let [selectedLabel, setSelectedLabel] = useState<string>('');
  let [selectedInfo, setSelectedInfo] = useState<LabelInfo | undefined>(undefined);
  let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);
  let [ownerList, setOwnerList] = useState<MinMemberInfo[]>([]);
  let [userId, setUserId] = useState<string>('');
  let [churchId, setChurchId] = useState<string>('');

  const onLabelClick = async (labelId:string) => {
    const lbl = churchLabels.labelMap.get(labelId);
    if (lbl) {
      setSelectedLabel(lbl.label_id);
      setSelectedInfo(lbl);

      // Load the members of the label
      await churchLabels.fetchMembersForLabel(lbl.label_id);

      // Get the label
      setMemberList(lbl.getMemberList());

      // Get the owners
      setOwnerList(lbl.getOwnerList());
    }
    else {
      setSelectedLabel('');
      setSelectedInfo(undefined);
      setMemberList([]);
      setOwnerList([]);
    }
  }

  useEffect(() => {
    const getUserInfo = async() => {
      const uInfo = new UserInfo();
      await uInfo.loadMemberInfo();
      setUserId(uInfo.member_id);
      setChurchId(uInfo.church_id);

      // Now load all the labels for the church
      await churchLabels.fetchAllLabels(uInfo.church_id);
      
      // Load the labels for the member
      await churchLabels.fetchMemberLabels(uInfo.member_id);

      // Load owners for all labels
      await churchLabels.fetchOwnersForLabel('asdf');

      // Set the church labels
      setChurchLabels(churchLabels);

      // Get the labels this user is a member of      
      const memberLabels = churchLabels.getMembership(uInfo.member_id);
      setMemberLabels(memberLabels);

      // Get the labels this user is an owner of
      const ownerLabels = churchLabels.getOwnership(uInfo.member_id);
      setOwnerLabels(ownerLabels);
    }

    getUserInfo();
  }, []);  

  return (
    <>
      <div>My Labels</div>
      <SLabelList labelList={memberLabels} onClick={onLabelClick} seletedLabel={selectedLabel}/>
      <div>Labels I Administer</div>
      <SLabelList labelList={ownerLabels} onClick={onLabelClick} seletedLabel={selectedLabel}/>
      <div>Label Info goes here</div>
      <SLabelInfo labelInfo={selectedInfo} memberList={memberList} ownerList={ownerList} userId={userId} churchId={churchId}/>
    </>
  );


}