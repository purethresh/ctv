import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo, ILabelInfo } from "../lib/LabelInfo";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import SLabelMember from "./SLabelMember";
import { ScheduleStatus } from "../lib/ScheduleStatus";
import { Typography } from "@mui/material";

export default function SScheduledLabel(props:SLabelGroupProps) {
    let [labelName, setLabelName] = useState<string>(props.groupInfo?.labelName || '');
    let [labelInfo, setLabelInfo] = useState<LabelInfo>(props.groupInfo || new LabelInfo({}));
    let [scheduledMemberList, setScheduledMemberList] = useState<MinMemberInfo[]>([]);
    let [nonScheduledMemberList, setNonScheduledMemberList] = useState<MinMemberInfo[]>([]);
    let [updateNumber, setUpdateNumber] = useState<number>(props.updateNumber || 0);
    let [showAddMember, setShowAddMember] = useState<boolean>(props.showAddMember || false);
    let [showRemoveMember, setShowRemoveMember] = useState<boolean>(props.showRemoveMember || false);
    
    const onAdd = (memberInfo:MinMemberInfo) => {
        if (props.onAddMember) {
            props.onAddMember(memberInfo, labelInfo);
        }
    }

    const onRemove = (memberInfo:MinMemberInfo) => {
        if (props.onRemoveMember) {
            props.onRemoveMember(memberInfo, labelInfo);
        }
    }

    const getInitialInfo = async() => {
        if (props.groupInfo !== undefined) {
            const lbl = props.groupInfo;
            setLabelName(lbl.labelName);
            setLabelInfo(lbl);
            setUpdateNumber(props.updateNumber || 0);

            // Get the members
            const sMemList:MinMemberInfo[] = [];
            const nsMemList:MinMemberInfo[] = [];
            lbl.memberMap.forEach((value, key) => {
                if (value.scheduledStatus === ScheduleStatus.scheduled) {
                    if (value.scheduledLabels.has(lbl.label_id)) {
                        // The member is scheduled for this label
                        sMemList.push(value);
                    }
                    else {
                        // The member is scheduled, but for a different label
                        nsMemList.push(value);
                    }                    
                }
                else {
                    // The member is not scheduled
                    nsMemList.push(value);
                }
            });

            nsMemList.sort(MinMemberInfo.compare);
            
            setScheduledMemberList(sMemList);
            setNonScheduledMemberList(nsMemList);
        }
    }

    useEffect(() => {
        getInitialInfo();
    }, [props.groupInfo, props.updateNumber]);
    
    return (
        <Box>
            <Box sx={{textAlign:'left', marginLeft:2}}>
                <Typography variant="subtitle2" color="primary.contrastText">{labelName}</Typography>
            </Box>            
            { scheduledMemberList.map((item, index) => (
                <SLabelMember key={item.member_id + props.groupInfo?.label_id + "scheduled"} memberInfo={item} removeMember={onRemove} updateNumber={updateNumber} showAdd={false} showRemove={showRemoveMember}/>
            ))}
            { nonScheduledMemberList.map((item, index) => (
                <SLabelMember key={item.member_id + props.groupInfo?.label_id + "not-scheduled"} memberInfo={item} addMember={onAdd} updateNumber={updateNumber} showAdd={showAddMember} showRemove={false}/>
            ))}
        </Box>
    )

}