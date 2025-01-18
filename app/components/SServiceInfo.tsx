"use client"
import { SServiceInfoProps } from "../props/SServiceInfoProps";
import { useState, useEffect } from 'react';
import ChurchLabels from "../lib/ChurchLabels";
import { LabelInfo} from "../lib/LabelInfo";
import { Box, Typography } from "@mui/material";
import { ServiceInfo } from "../lib/ServiceInfo";
import SLabelGroup from "./SLabelGroup";
import { ChurchSchedule } from "../lib/ChurchSchedule";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import { API_CALLS, APIHandler } from "../lib/APIHanlder";

export default function SServiceInfo(props: SServiceInfoProps) {
  let [allLabels, setAllLabels] = useState<ChurchLabels>(new ChurchLabels());
  let [churchSchedule, setChurchSchedule] = useState<ChurchSchedule>(new ChurchSchedule(props.serviceInfo?.church_id || ''));
  let [labelGroupList, setLabelGroupList] = useState<LabelInfo[]>([]);
  let [sInfo, setSInfo] = useState<ServiceInfo>(props.serviceInfo || new ServiceInfo({}));
  let [serviceTime, setServiceTime] = useState<string>('');
  let [updateNum, setUpdateNum] = useState<number>(0);

  const addMember = async (memberInfo:MinMemberInfo, labelInfo:LabelInfo) => {
    // Values we need to schedule
    const cId = sInfo.church_id;
    const sId = sInfo.service_id;
    const lId = labelInfo.label_id;
    const mId = memberInfo.member_id;

    // Do the Schedule
    const api = new APIHandler();
    await api.postData(API_CALLS.schedule, {church_id: cId, service_id: sId, label_id: lId, member_id: mId});

    // Refetch the schedule without cache
    churchSchedule.useCache = false;
    
    const sTime = sInfo.serviceAsDate();
    await churchSchedule.fetchScheduleWithBufferMonths(sTime);
    churchSchedule.useCache = true;

    await getInitialInfo();
    setUpdateNum(updateNum + 1);
  }

  const removeMember = async (memberInfo:MinMemberInfo, labelInfo:LabelInfo) => {
    // Values we need to schedule
    const sId = sInfo.service_id;
    const lId = labelInfo.label_id;
    const mId = memberInfo.member_id;

    // Do the Schedule
    const api = new APIHandler();
    await api.removeData(API_CALLS.schedule, {service_id: sId, label_id: lId, member_id: mId});

    // Refetch the schedule without cache
    churchSchedule.useCache = false;
    const sTime = sInfo.serviceAsDate();
    await churchSchedule.fetchScheduleWithBufferMonths(sTime);
    churchSchedule.useCache = true;

    await getInitialInfo();
    setUpdateNum(updateNum + 1);
  }
  
  const updateServiceInfo = async() => {
      // Get the scheduled members
      if (sInfo.service_id.length > 0) {
        const sId:string = sInfo.service_id;
        await allLabels.fetchScheduledLabels(sId);
      }
  }

  const getInitialInfo = async() => {
    if (sInfo.church_id.length > 0) {
      const cId:string = sInfo.church_id;
      await allLabels.fetchAllLabels(cId);

      // Get the time
      const sTime = sInfo.serviceAsDate();
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      const str = new Intl.DateTimeFormat('en-US', options).format(sTime);
      setServiceTime(str);

      // Get the members for each scheduled label
      await allLabels.fetchMembersForScheduledLabels();

      // Get all the scheduled services for the month (before, current, and after)
      await churchSchedule.fetchScheduleWithBufferMonths(sTime);

      // Get all the blocked out days
      await churchSchedule.fetchBlockedOutDaysWithBufferMonths(sTime)

      // If there is a service id, then get the scheduled members
      await updateServiceInfo();

      // Now get the service schedule
      churchSchedule.updateMembersWithSchedule(allLabels.getMemberMap(), sInfo.service_id);

      // Also update availability
      churchSchedule.updateMemberWithBlockOutDays(allLabels.getMemberMap(), sInfo.serviceAsDate());

      setUpdateNum(updateNum + 1);

      // Get the label groups
      const lGroup = allLabels.getLabelGroups();
      setLabelGroupList(lGroup);
    }
  }

  useEffect(() => {
    getInitialInfo();
  }, [props.serviceInfo]);

  return (
    <Box>
      <Box bgcolor='secondary.main'><Typography variant="h6" color='secondary.contrastText' sx={{padding: '5px'}}>{serviceTime} - {sInfo.name}</Typography></Box>
      <Box bgcolor='secondary.dark'><Typography variant="subtitle1" color='secondary.contrastText' sx={{padding: '5px'}}>{sInfo.info}</Typography></Box>      
      {labelGroupList.map((item, index) => (
        <SLabelGroup key={item.label_id} groupInfo={item} updateNumber={updateNum} onAddMember={addMember} onRemoveMember={removeMember} showAddMember={true} showRemoveMember={true} />
      ))}      
    </Box>
  );
}