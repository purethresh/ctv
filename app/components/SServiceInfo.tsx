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

      // Get the label groups
      const lGroup = allLabels.getLabelGroups();
      setLabelGroupList(lGroup);

      // Get the time
      const tString = new Date(sInfo.serviceTime).toLocaleTimeString();
      setServiceTime(tString);

      // Get the members for each scheduled label
      await allLabels.fetchMembersForScheduledLabels();

      // Get all the scheduled services for the month (before, current, and after)
      await churchSchedule.fetchScheduleWithBuffer(new Date(sInfo.serviceTime));

      // If there is a service id, then get the scheduled members
      await updateServiceInfo();
    }
  }

  useEffect(() => {
    getInitialInfo();
  }, [props.serviceInfo]);

  // TODO JLS - Here
  // Show label groups
  // Pass in the all Labels object
  // If a user is added or removed, update the obj. And update within the component
  // (Show blue for scheduled, green for suggesteed, and red for blocked)
  // Also show the number of times a person has been scheduled in prev, this, and next month
  // Sort them by that number

  return (
    <Box>
      {sInfo.name} {serviceTime}<br />
      {sInfo.info}
      {labelGroupList.map((item, index) => (
        <SLabelGroup key={item.label_id} groupInfo={item} />
      ))}      
    </Box>
  );
}