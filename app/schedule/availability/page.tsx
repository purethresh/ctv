"use client"

import SPersonCalendar from "@/app/components/SPersonCalendar";
import { useState, useEffect } from 'react';
import UserInfo from "@/app/lib/UserInfo";
import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import SAvailabilityList from "@/app/components/SAvailabilityList";

export default function AvailabilityPage() {
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [churchId, setChurchId] = useState<string>('');
  let [currentUserId, setCurrentUserId] = useState<string>('');

  // TODO JLS
  // * Show Calendar
  // * Background color for unavailable days
  // * Show dropdown of members (defaulting to current user)
  // * Show list of unavailable days. Each item also has a button to remove it.
  //
  // * When a day is clicked, that day is toggled in the list (and saved)
  // * When click on remove in list, that day becomes available again (and saved)

  const getBlockOutDays = async(memberId:string, min:number, max:number) => {
    const res = await fetch(`/api/available?member_id=${memberId}&min=${min}&max=${max}`, { cache: 'force-cache' });
    const data = await res.json();

    // TODO JLS HERE
    // TODO JLS, need to render the days, and update the calendar to show block out days
  }


  useEffect(() => {    
    const getUserInfo = async() => {
        const uInfo = new UserInfo();

        await uInfo.loadMemberInfo();
        setUserInfo(uInfo);
        setChurchId(uInfo.church_id);
        setCurrentUserId(uInfo.member_id);

        const dt = new Date();
        const dtMinStr = `${dt.getFullYear()}-${dt.getMonth() + 1}-01`;
        const dtMin = new Date(dtMinStr);
        const min = dtMin.getTime() / 1000;
        dtMin.setMonth(dtMin.getMonth() + 1);
        const max = dtMin.getTime() / 1000;
        
        await getBlockOutDays(uInfo.member_id, min, max);
    }    

    getUserInfo();        
  }, []);  

  return (
    <>
      {userInfo.first} {userInfo.last}
      <SAllMemberSelect churchId={churchId} isVisible={true} defaultMemberId={currentUserId} />      
      <SPersonCalendar memberId={currentUserId} />      
      <SAvailabilityList />
    </>
  );
}