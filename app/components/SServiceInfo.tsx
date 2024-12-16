"use client"
import { SServiceInfoProps } from "../props/SServiceInfoProps";
import { useState, useEffect } from 'react';
import ChurchLabels from "../lib/ChurchLabels";
import { LabelInfo} from "../lib/LabelInfo";
import { Box } from "@mui/material";
import { ServiceInfo } from "../lib/ServiceInfo";
import SLabelGroup from "./SLabelGroup";
import { ChurchSchedule } from "../lib/ChurchSchedule";

export default function SServiceInfo(props: SServiceInfoProps) {
  let [allLabels, setAllLabels] = useState<ChurchLabels>(new ChurchLabels());
  let [churchSchedule, setChurchSchedule] = useState<ChurchSchedule>(new ChurchSchedule(props.serviceInfo?.church_id || ''));
  let [labelGroupList, setLabelGroupList] = useState<LabelInfo[]>([]);
  let [sInfo, setSInfo] = useState<ServiceInfo>(props.serviceInfo || new ServiceInfo({}));
  let [serviceTime, setServiceTime] = useState<string>('');
  let [updateNum, setUpdateNum] = useState<number>(0);
  
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
      const tString = new Date(sInfo.serviceTime).toLocaleTimeString();
      setServiceTime(tString);

      // Get the members for each scheduled label
      await allLabels.fetchMembersForScheduledLabels();

      // Get all the scheduled services for the month (before, current, and after)
      const sTime = new Date(sInfo.serviceTime);
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
      {sInfo.name} {serviceTime}<br />
      {sInfo.info}
      {labelGroupList.map((item, index) => (
        <SLabelGroup key={item.label_id} groupInfo={item} updateNumber={updateNum} />
      ))}      
    </Box>
  );
}