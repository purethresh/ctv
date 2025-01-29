"use client"

import SPersonCalendar from "@/app/components/SPersonCalendar";
import { useState, useEffect } from 'react';
import UserInfo from "@/app/lib/UserInfo";
import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import SAvailabilityList from "@/app/components/SAvailabilityList";
import { getDefaultSunday } from "@/app/lib/DateUtils";
import { v4 } from 'uuid';
import { IAvailabilityInfo, AvailabilityInfo } from "@/app/lib/AvailabilityInfo";
import { API_CALLS, APIHandler } from "@/app/lib/APIHanlder";
import { Grid2, Paper } from "@mui/material";
import { AvailabilityPageData } from "@/app/db/AvailabilityPageData";

export default function AvailabilityPage() {
  let [pageData, setPageData] = useState<AvailabilityPageData>(new AvailabilityPageData());

  // let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  // let [churchId, setChurchId] = useState<string>('');
  let [currentUserId, setCurrentUserId] = useState<string>('');
  let [blockOutList, setBlockOutList] = useState<number[]>([]);
  let [blockOutMap, setBlockOutMap] = useState<Map<number, AvailabilityInfo>>(new Map<number, AvailabilityInfo>());
  let [blockFullList, setBlockFullList] = useState<AvailabilityInfo[]>([]);
  let [currentViewedDate, setCurrentViewedDate] = useState<Date>(new Date(getDefaultSunday()));

  const onMemberChanged = async (memberId:string) => {
    setCurrentUserId(memberId);
    await getBlockOutDays(memberId, getMonthStart(currentViewedDate), getMonthEnd(currentViewedDate));
  }

  const addBlockOutDay = async(aInfo:AvailabilityInfo) => {
    const api = new APIHandler();
    await api.postData(API_CALLS.availability, aInfo);
  }

  const removeBlockOutDay = async(aInfo:AvailabilityInfo) => {
    const api = new APIHandler();
    await api.removeData(API_CALLS.availability, {availability_id: aInfo.availability_id});
  }

  const getBlockOutDays = async(memberId:string, min:number, max:number) => {
    // Don't use cache for this one
    const api = new APIHandler();
    const res = await api.getData(API_CALLS.availability, { member_id: memberId, min: min.toString(), max: max.toString() });
    const data = await res.json();

    // Loop through the datat and track the days blocked out.
    const blockedOut:number[] = [];
    const blockMap:Map<number, AvailabilityInfo> = new Map<number, AvailabilityInfo>();
    const bList:AvailabilityInfo[] = [];
    for(var i=0; i<data.length; i++) {
      const info = data[i] as IAvailabilityInfo;
      const epoc = Number(info.blockOutDay);
      const dayNum = new Date(epoc).getDate();

      const aInfo = new AvailabilityInfo(info);
      blockMap.set(dayNum, aInfo);
      blockedOut.push(dayNum);
      bList.push(aInfo);
    }

    setBlockOutMap(blockMap);
    setBlockOutList(blockedOut);
    setBlockFullList(bList);
  }

  const onRemoveBlockedDate = async (aInfo:AvailabilityInfo) => {
    await onDateChanged(aInfo.blockedAsDate)
  }

  const onDateChanged = async (date:Date) => { 
    // The date has been clicked on. So toggle it here
    const dayNum = date.getDate();

    // We have one, so remove it
    if (blockOutMap.has(dayNum)) {
      const aInfo = blockOutMap.get(dayNum);
      blockOutMap.delete(dayNum);
      
      if (aInfo != undefined) {
        await removeBlockOutDay(aInfo);
      }
    }
    else {
      // We don't have one so add it
      const aInfo:AvailabilityInfo = new AvailabilityInfo({ availability_id:v4(), member_id:currentUserId, blockOutDay: date.getTime().toString() } as IAvailabilityInfo);
      blockOutMap.set(dayNum, aInfo);

      await addBlockOutDay(aInfo);
    }
    setBlockOutMap(blockOutMap);

    // Re-create the list
    const blockedOut:number[] = [];
    const fullList:AvailabilityInfo[] = [];
    blockOutMap.forEach((value, key) => {
      blockedOut.push(key);
      fullList.push(value);
    });

    // Sort the list
    fullList.sort((a, b) => {
      return Number(a.blockOutDay) - Number(b.blockOutDay);
    });

    setBlockOutList(blockedOut);    
    setBlockFullList(fullList);
  }

  const onMonthYearChanged = async (month:string, year:string) => {
    // Convert to a date
    const dtStr = `${year}-${month}-01`;
    const dt = new Date(dtStr);

    setCurrentViewedDate(dt);
    await getBlockOutDays(currentUserId, getMonthStart(dt), getMonthEnd(dt));
  }

  const getMonthStart = (dt:Date): number => {
    const timeMill = dt.getTime() + (dt.getTimezoneOffset() * 60 * 1000);
    const dUpdated = new Date(timeMill);

    const dtStr = `${dUpdated.getFullYear()}-${dUpdated.getMonth() + 1}-01`;
    const dtDate = new Date(dtStr);

    return dtDate.getTime();    
  }

  const getMonthEnd = (dt:Date): number => {
    const timeMill = dt.getTime() + (dt.getTimezoneOffset() * 60 * 1000);
    const dUpdated = new Date(timeMill);

    // Get the start of the month
    const dtStr = `${dUpdated.getFullYear()}-${dUpdated.getMonth() + 1}-01`;
    const dtDate = new Date(dtStr);

    // Now increment the month
    dtDate.setMonth(dtDate.getMonth() + 1);
    return dtDate.getTime();
  }


  useEffect(() => {    
    const getUserInfo = async() => {
      const pData = pageData;
      await pData.loadMemberInfo();

      setPageData(pData);
      setCurrentUserId(pData.uInfo.member_id);

      await getBlockOutDays(pData.uInfo.member_id, getMonthStart(currentViewedDate), getMonthEnd(currentViewedDate));
    }    

    getUserInfo();        
  }, []);

  // TODO JLS - fix db calls for this page
  
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <Paper>
          <SAllMemberSelect churchId={pageData.uInfo.church_id} isVisible={true} defaultMemberId={currentUserId} onClick={onMemberChanged} useFilter={false} />
        </Paper>
      </Grid2>      
      <SPersonCalendar memberId={currentUserId} restrictedDays={blockOutList} onDateChanged={onDateChanged} onMonthChanged={onMonthYearChanged} />      
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <SAvailabilityList blockedList={blockFullList} onRemove={onRemoveBlockedDate} />
      </Grid2>
    </Grid2>
  );
}