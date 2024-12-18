"use client"

import React, { useState, useEffect } from 'react';
import UserInfo from '@/app/lib/UserInfo';
import ChurchLabels from '@/app/lib/ChurchLabels';
import { LabelInfo } from '@/app/lib/LabelInfo';
import SLabelList from '@/app/components/SLabelList';
import SLabelInfo from '@/app/components/SLabelInfo';
import { MinMemberInfo } from '@/app/lib/MinMemberInfo';

export default function LabelPage() {
  let [churchLabels, setChurchLabels] = useState<ChurchLabels>(new ChurchLabels());
  let [memberLabels, setMemberLabels] = useState<LabelInfo[]>([]);
  let [selectedLabel, setSelectedLabel] = useState<string>('');
  let [selectedInfo, setSelectedInfo] = useState<LabelInfo | undefined>(undefined);
  let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);
  let [ownerList, setOwnerList] = useState<MinMemberInfo[]>([]);
  let [userId, setUserId] = useState<string>('');
  let [churchId, setChurchId] = useState<string>('');
  let [memberMap, setMemberMap] = useState<Map<string, MinMemberInfo>>(new Map());

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

  const reloadLabelInfo = async() => {
    await updateUserInfo();
  }

  const addMemberToLabel = async (memberId:string, labelId:string, asOwner:boolean) => {
    // Get the member info
    const m = memberMap.get(memberId);
    if (m !== undefined) {
      // Get Label
      const l = churchLabels.labelMap.get(labelId);
      var labelQuery = `/api/labels/member?member_id=${memberId}&label_id=${labelId}&owner=`;
      if (l !== undefined) {
        if (asOwner) {
          l.addOwner(m);
          setSelectedInfo(l);
          labelQuery += 'false';
        }
        else {
          l.addMember(m);
          setSelectedInfo(l);
          labelQuery += 'true';
        }

        // Update the label
        const result = await fetch(labelQuery, {method: 'POST'});

        // Reload
        await onLabelClick(labelId);
      }
    }
  }

  const removeMemberFromLabel = async (memberId:string, labelId:string, asOwner:boolean) => {
    // TODO JLS - here
    // Need to implement removing a member from a label
  }

  const getAllMembers = async (churchId:string) => {
      const result = await fetch(`/api/member?church_id=${churchId}`);
      var rs = await result.json();

      const mMap = new Map<string, MinMemberInfo>();
      for(var i=0; i<rs.length; i++) {
        const m = new MinMemberInfo(rs[i]);
        mMap.set(m.member_id, m);
      }
      setMemberMap(mMap);
  }  

  const updateUserInfo = async() => {
      const uInfo = new UserInfo();
      await uInfo.loadMemberInfo();
      setUserId(uInfo.member_id);
      setChurchId(uInfo.church_id);

      // Load all members
      await getAllMembers(uInfo.church_id);

      // Turn off caching
      churchLabels.shouldUseCache(false);

      // Now load all the labels for the church
      await churchLabels.fetchAllLabels(uInfo.church_id);
      
      // Load the labels for the member
      await churchLabels.fetchMemberLabels(uInfo.member_id);

      // Load owners for all labels
      await churchLabels.fetchOwnersForLabel('asdf');

      // Set the church labels
      setChurchLabels(churchLabels);

      const lst = churchLabels.getMemberAndOwner(uInfo.member_id);
      setMemberLabels(lst);

      // Turn caching back on
      churchLabels.shouldUseCache(true);
  }

  useEffect(() => {
    updateUserInfo();
  }, []);  

  return (
    <>
      <div>My Labels</div>
      <SLabelList labelList={memberLabels} userId={userId} onClick={onLabelClick} seletedLabel={selectedLabel}/>
      <div>Label Info goes here</div>
      <SLabelInfo labelInfo={selectedInfo} memberList={memberList} ownerList={ownerList} userId={userId} churchId={churchId} onReload={reloadLabelInfo} onAddMember={addMemberToLabel} onRemoveMember={removeMemberFromLabel}/>
    </>
  );


}