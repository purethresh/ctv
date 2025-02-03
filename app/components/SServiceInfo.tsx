"use client"
import { SServiceInfoProps } from "../props/SServiceInfoProps";
import { useState, useEffect } from 'react';
import { LabelInfo} from "../lib/LabelInfo";
import { Box, Typography } from "@mui/material";
import SLabelGroup from "./SLabelGroup";
import { MinMemberInfo } from "../lib/MinMemberInfo";

export default function SServiceInfo(props: SServiceInfoProps) {
  let [labelGroupList, setLabelGroupList] = useState<LabelInfo[]>([]);
  let [serviceTime, setServiceTime] = useState<string>('');

  const addMember = async (memberInfo:MinMemberInfo, labelInfo:LabelInfo) => {
    const sInfo = props.serviceInfo;

    // Values we need to schedule
    const cId = sInfo.church_id;
    const sId = sInfo.service_id;
    const lId = labelInfo.label_id;
    const mId = memberInfo.member_id;

    // Do the Schedule
    if (props.onAddMemberToSchedule) {
      props.onAddMemberToSchedule({church_id: cId, service_id: sId, label_id: lId, member_id: mId}, sInfo.serviceAsDate());
    }
  }

  const removeMember = async (memberInfo:MinMemberInfo, labelInfo:LabelInfo) => {
    const sInfo = props.serviceInfo;

    // Values we need to schedule
    const sId = sInfo.service_id;
    const lId = labelInfo.label_id;
    const mId = memberInfo.member_id;

    // Do the Schedule
    if (props.onRemoveMemberFromSchedule) {
      props.onRemoveMemberFromSchedule({service_id: sId, label_id: lId, member_id: mId}, sInfo.serviceAsDate());
    }
  }

  const getServiceInfo = async () => {
    const sInfo = props.serviceInfo;
    if (sInfo.church_id.length > 0) {

      // Get the time
      const sTime = sInfo.serviceAsDate();
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      const str = new Intl.DateTimeFormat('en-US', options).format(sTime);
      setServiceTime(str);

      // Get the label groups
      const lGroup = props.churchLabels.getLabelGroups();
      setLabelGroupList(lGroup);
    }
  }

  useEffect(() => {
    // getInitialInfo();
    getServiceInfo();
  }, [props.serviceInfo, props.churchLabels, props.schedule]);

  return (
    <Box>
      <Box bgcolor='secondary.main'><Typography variant="h6" color='secondary.contrastText' sx={{padding: '5px'}}>{serviceTime} - {props.serviceInfo.name}</Typography></Box>
      <Box bgcolor='secondary.dark'><Typography variant="subtitle1" color='secondary.contrastText' sx={{padding: '5px'}}>{props.serviceInfo.info}</Typography></Box>      
      {labelGroupList.map((item, index) => (
        <SLabelGroup key={item.label_id} groupInfo={item} onAddMember={addMember} onRemoveMember={removeMember} showAddMember={true} showRemoveMember={true} />
      ))}      
    </Box>
  );
}