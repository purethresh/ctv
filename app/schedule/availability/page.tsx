"use client"

import SPersonCalendar from "@/app/components/SPersonCalendar";
import { useState, useEffect } from 'react';
import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import SAvailabilityList from "@/app/components/SAvailabilityList";
import { getDefaultSunday } from "@/app/lib/DateUtils";
import { v4 } from 'uuid';
import { IAvailabilityInfo, AvailabilityInfo } from "@/app/lib/AvailabilityInfo";
import { Grid2, Paper } from "@mui/material";
import { AvailabilityPageData } from "@/app/db/AvailabilityPageData";
import { MinMemberInfo } from "@/app/lib/MinMemberInfo";

export default function AvailabilityPage() {
  let [pageData, setPageData] = useState<AvailabilityPageData>(new AvailabilityPageData());
  let [currentUserId, setCurrentUserId] = useState<string>('');
  let [blockOutList, setBlockOutList] = useState<number[]>([]);
  let [blockOutMap, setBlockOutMap] = useState<Map<number, AvailabilityInfo>>(new Map<number, AvailabilityInfo>());
  let [blockFullList, setBlockFullList] = useState<AvailabilityInfo[]>([]);
  let [currentViewedDate, setCurrentViewedDate] = useState<Date>(new Date(getDefaultSunday()));
  let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);

  const onMemberChanged = async (memberId:string) => {
    setCurrentUserId(memberId);
    await getBlockOutDays(memberId, currentViewedDate);
  }

  const addBlockOutDay = async(aInfo:AvailabilityInfo) => {
    const pData = pageData;
    await pData.addBlockOutDay(aInfo);

    setBlockOutMap(pData.blockOutMap);
    setBlockOutList(pData.blockOutList);
    setBlockFullList(pData.blockFullList);
    setPageData(pData);
  }

  const removeBlockOutDay = async(aInfo:AvailabilityInfo) => {
    const pData = pageData;
    await pData.removeBlockOutDay(aInfo);

    setBlockOutMap(pData.blockOutMap);
    setBlockOutList(pData.blockOutList);
    setBlockFullList(pData.blockFullList);
    setPageData(pData);
  }

  const getBlockOutDays = async(memberId:string, dt:Date) => {
    const pData = pageData;
    await pData.loadBlockOutInfo(memberId, dt);

    setBlockOutMap(pData.blockOutMap);
    setBlockOutList(pData.blockOutList);
    setBlockFullList(pData.blockFullList);
    setPageData(pData);
  }

  const onRemoveBlockedDate = async (aInfo:AvailabilityInfo) => {
    await onDateChanged(aInfo.blockedAsDate);
  }

  const onDateChanged = async (date:Date) => { 
    // The date has been clicked on. So toggle it here
    const dayNum = date.getDate();

    // We have one, so remove it
    if (blockOutMap.has(dayNum)) {
      const aInfo = blockOutMap.get(dayNum);
      if (aInfo != undefined) {
        await removeBlockOutDay(aInfo);
      }
    }
    else {
      // We don't have one so add it
      const aInfo:AvailabilityInfo = new AvailabilityInfo({ availability_id:v4(), member_id:currentUserId, blockOutDay: date.getTime().toString() } as IAvailabilityInfo);
      await addBlockOutDay(aInfo);
    }
  }

  const onMonthYearChanged = async (dt:Date) => {
    setCurrentViewedDate(dt);
    await getBlockOutDays(currentUserId, dt);
  }

  useEffect(() => {    
    const getUserInfo = async() => {
      // Load Member Info
      const pData = pageData;
      await pData.loadMemberInfo();
      const uInfo = pData.uInfo;

      // Load availability
      await pData.loadBlockOutInfo(uInfo.member_id, currentViewedDate);

      // Load the members in the list
      await pData.loadAllMembers();

      // Set the state
      setCurrentUserId(uInfo.member_id);
      setBlockOutMap(pData.blockOutMap);
      setBlockOutList(pData.blockOutList);
      setBlockFullList(pData.blockFullList);
      setMemberList(pData.memberList);
      setPageData(pData);
    }    

    getUserInfo();        
  }, []);
  
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <Paper>
          <SAllMemberSelect isVisible={true} defaultMemberId={currentUserId} onClick={onMemberChanged} memberList={memberList}/>
        </Paper>
      </Grid2>      
      <SPersonCalendar restrictedDays={blockOutList} onDateChanged={onDateChanged} onMonthChanged={onMonthYearChanged} />      
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <SAvailabilityList blockedList={blockFullList} onRemove={onRemoveBlockedDate} />
      </Grid2>
    </Grid2>
  );
}