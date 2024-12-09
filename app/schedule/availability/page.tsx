"use client"

import SPersonCalendar from "@/app/components/SPersonCalendar";
import { useState, useEffect } from 'react';
import UserInfo from "@/app/lib/UserInfo";
import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import SAvailabilityList from "@/app/components/SAvailabilityList";
import { getDefaultSunday } from "@/app/lib/dateUtils";
import { v4 } from 'uuid';
import { AvailabilityInfo } from "@/app/lib/AvailabilityInfo";

// TODO JLS
// Show a list of blocked out days AvailabilityInfo

export default function AvailabilityPage() {
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [churchId, setChurchId] = useState<string>('');
  let [currentUserId, setCurrentUserId] = useState<string>('');
  let [blockOutList, setBlockOutList] = useState<number[]>([]);
  let [blockOutMap, setBlockOutMap] = useState<Map<number, AvailabilityInfo>>(new Map<number, AvailabilityInfo>());

  const addBlockOutDay = async(aInfo:AvailabilityInfo) => {
    await fetch(`/api/available`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aInfo) });
  }

  const removeBlockOutDay = async(aInfo:AvailabilityInfo) => {
    await fetch(`/api/available?availability_id=${aInfo.availability_id}`, { method: 'DELETE' });
  }

  const getBlockOutDays = async(memberId:string, min:number, max:number) => {
    // Don't use cache for this one
    const res = await fetch(`/api/available?member_id=${memberId}&min=${min}&max=${max}`);
    const data = await res.json();

    // Loop through the datat and track the days blocked out.
    const blockedOut:number[] = [];
    const blockMap:Map<number, AvailabilityInfo> = new Map<number, AvailabilityInfo>();
    for(var i=0; i<data.length; i++) {
      const info = data[i] as AvailabilityInfo;
      const epoc = Number(info.blockOutDay);
      const dayNum = new Date(epoc).getDate();

      blockMap.set(dayNum, info);
      blockedOut.push(dayNum);
    }

    setBlockOutMap(blockMap);
    setBlockOutList(blockedOut);
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
      const aInfo:AvailabilityInfo = {
        availability_id: v4(),
        member_id: currentUserId,
        blockOutDay: date.getTime().toString()
      };
      blockOutMap.set(dayNum, aInfo);

      await addBlockOutDay(aInfo);
    }
    setBlockOutMap(blockOutMap);

    // Re-create the list
    const blockedOut:number[] = [];
    blockOutMap.forEach((value, key) => {
      blockedOut.push(key);
    });
    setBlockOutList(blockedOut);    
  }

  const onMonthYearChanged = async (month:string, year:string) => {
    // Convert to a date
    const dtStr = `${year}-${month}-01`;
    const dt = new Date(dtStr);

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
        const uInfo = new UserInfo();

        await uInfo.loadMemberInfo();
        setUserInfo(uInfo);
        setChurchId(uInfo.church_id);
        setCurrentUserId(uInfo.member_id);

        const dt = new Date(getDefaultSunday());
        await getBlockOutDays(uInfo.member_id, getMonthStart(dt), getMonthEnd(dt));
    }    

    getUserInfo();        
  }, []);  

  return (
    <>
      {userInfo.first} {userInfo.last}
      <SAllMemberSelect churchId={churchId} isVisible={true} defaultMemberId={currentUserId} />      
      <SPersonCalendar memberId={currentUserId} restrictedDays={blockOutList} onDateChanged={onDateChanged} onMonthChanged={onMonthYearChanged} />      
      <SAvailabilityList />
    </>
  );
}