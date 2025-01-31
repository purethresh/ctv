"use client"

import React, { useState, useEffect } from 'react';
import { LabelInfo } from '@/app/lib/LabelInfo';
import SLabelList from '@/app/components/SLabelList';
import SLabelInfo from '@/app/components/SLabelInfo';
import { MinMemberInfo } from '@/app/lib/MinMemberInfo';
import { Grid2, Paper, Box, Typography } from '@mui/material';
import { LabelPageData } from '@/app/db/LabelPageData';

export default function LabelPage() {
  let [pageData, setPageData] = useState<LabelPageData>(new LabelPageData());
  let [memberLabels, setMemberLabels] = useState<LabelInfo[]>([]);
  let [userId, setUserId] = useState<string>('');
  let [selectedLabel, setSelectedLabel] = useState<string>('');
  let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);
  let [churchMembers, setChurchMembers] = useState<MinMemberInfo[]>([]);
  let [ownerList, setOwnerList] = useState<MinMemberInfo[]>([]);
  let [selectedInfo, setSelectedInfo] = useState<LabelInfo | undefined>(undefined);

  const onLabelClick = async (labelId:string) => {
    const pData = pageData;
    const lbl = pData.churchLabels.labelMap.get(labelId);
    var lblId = lbl?.label_id || '';
    var mList:MinMemberInfo[] = [];
    var oList:MinMemberInfo[] = [];

    if (lbl) {
      await pData.loadMembersForLabel(lblId);

      mList = lbl.getMemberList();
      oList = lbl.getOwnerList();
    }

    setSelectedLabel(lblId);
    setSelectedInfo(lbl);
    setMemberList(mList);
    setOwnerList(oList);
  }

  const addMemberToLabel = async (memberId:string, labelId:string, asOwner:boolean) => {
    await pageData.addMemberToLabel(memberId, labelId, asOwner);
  }

  const removeMemberFromLabel = async (memberId:string, labelId:string) => {
    await pageData.removeMemberFromLabel(memberId, labelId);
  }

  const removeLabel = async (labelId:string) => {
    await pageData.removeLabel(labelId);
  }

  const updateLabel = async (lbl:LabelInfo) => {
    const data = {  label_id: lbl.label_id,
                    labelName: lbl.labelName,
                    labelDescription: lbl.labelDescription,
                    church_id: pageData.uInfo.church_id,
                    forSchedule: lbl.forSchedule ? 'true' : 'false',
                    scheduleGroup: lbl.scheduleGroup ? 'true' : 'false',
                    owner_id: lbl.owner_id,
                    updateType: lbl.updateType};

    await pageData.updateLabel(data);
    // Unselect the current label
    setSelectedLabel('');
    setSelectedInfo(undefined);
    getInitialState();
  }

  const getInitialState = async () => {
    const pData = pageData;

    // Load the user info
    await pData.loadMemberInfo();

    // Load all the member
    await pData.loadAllMembers();

    // Load all the labels
    await pData.loadChurchLabels();

    // Load the labels for the member
    await pData.loadMemberLabels(pData.uInfo.member_id);

    // Load owners
    await pData.loadAllOwners();

    // Get list of labels
    const lst = pData.churchLabels.getMemberAndOwner(pData.uInfo.member_id);

    // Sort the labels
    lst.sort((a:LabelInfo, b:LabelInfo) => {
      if (a.labelName < b.labelName) {
        return -1;
      }
      if (a.labelName > b.labelName) {
        return 1;
      }
      return 0;
    });

    setChurchMembers(pData.memberList);
    setUserId(pData.uInfo.member_id);
    setMemberLabels(lst);
    setPageData(pData);
  }

  useEffect(() => {
    getInitialState();
  }, []);  

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <Paper>
          <Box sx={{ paddingBottom: '5px'}}>
            <Box bgcolor={'secondary.main'} sx={{ padding: '2px', marginBottom: '5px'}}>
              <Typography variant='h6' color='secondary.contrastText'>My Labels</Typography>
            </Box>            
            <SLabelList labelList={memberLabels} userId={userId} onClick={onLabelClick} seletedLabel={selectedLabel}/>
          </Box>
        </Paper>
      </Grid2>
      <Grid2 size={12}>
        <SLabelInfo labelInfo={selectedInfo} memberList={memberList} allMembers={churchMembers} ownerList={ownerList} userId={userId} onAddMember={addMemberToLabel} onRemoveMember={removeMemberFromLabel} onDeleteLabel={removeLabel} onUpdateLabel={updateLabel}/>
      </Grid2>
    </Grid2>
  );


}