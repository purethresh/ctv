import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo, ILabelInfo } from "../lib/LabelInfo";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import SLabelMember from "./SLabelMember";
import { ScheduleStatus } from "../lib/ScheduleStatus";
import { Typography } from "@mui/material";
import { FullMemberInfo } from "../lib/FullMemberInfo";

export default function SScheduledLabel(props:SLabelGroupProps) {

    let [labelMargin, setLabelMargin] = useState<number>(2);
    let [labelName, setLabelName] = useState<string>(props.groupInfo?.labelName || '');
    let [labelInfo, setLabelInfo] = useState<LabelInfo>(props.groupInfo || new LabelInfo({}));
    let [scheduledMemberList, setScheduledMemberList] = useState<FullMemberInfo[]>([]);
    let [nonScheduledMemberList, setNonScheduledMemberList] = useState<FullMemberInfo[]>([]);
    let [updateNumber, setUpdateNumber] = useState<number>(props.updateNumber || 0);
    let [showAddMember, setShowAddMember] = useState<boolean>(props.showAddMember || false);
    let [showRemoveMember, setShowRemoveMember] = useState<boolean>(props.showRemoveMember || false);
    let [memberMap, setMemberMap] = useState<Map<string, FullMemberInfo>>(new Map<string, FullMemberInfo>());
    let [serviceId, setServiceId] = useState<string>('');
    
    const onAdd = (memberInfo:FullMemberInfo) => {
        if (props.onAddMember) {
            props.onAddMember(memberInfo, labelInfo);
        }
    }

    const onRemove = (memberInfo:FullMemberInfo) => {
        if (props.onRemoveMember) {
            props.onRemoveMember(memberInfo, labelInfo);
        }
    }

    const getInitialInfo = async() => {
        if (props.groupInfo !== undefined) {
            setShowAddMember(props.showAddMember || false);
            setShowRemoveMember(props.showRemoveMember || false);

            if (props.members !== undefined) {
                setMemberMap(props.members);
            }

            if (props.serviceId !== undefined) {
                setServiceId(props.serviceId);
            }

            const lbl = props.groupInfo;
            setLabelName(lbl.labelName);
            setLabelInfo(lbl);
            setUpdateNumber(props.updateNumber || 0);

            if (lbl.scheduleGroup) {
                setLabelMargin(2);
            }
            else {
                setLabelMargin(4);
            }

            // Get the members
            const sMemList:FullMemberInfo[] = [];
            const nsMemList:FullMemberInfo[] = [];
            lbl.memberSet.forEach((value) => {
                const mInfo = memberMap.get(value);
                if (mInfo !== undefined) {
                    if (mInfo.isScheduledForLabel(serviceId, lbl.label_id)) {
                        sMemList.push(mInfo);
                    }
                    else {
                        nsMemList.push(mInfo);
                    }
                }
            });

            // lbl.memberMap.forEach((value, key) => {
            //     if (value.scheduledStatus === ScheduleStatus.scheduled) {
            //         if (value.scheduledLabels.has(lbl.label_id)) {
            //             // The member is scheduled for this label
            //             sMemList.push(value);
            //         }
            //         else {
            //             // The member is scheduled, but for a different label
            //             nsMemList.push(value);
            //         }                    
            //     }
            //     else {
            //         // The member is not scheduled
            //         nsMemList.push(value);
            //     }
            // });

            // nsMemList.sort(MinMemberInfo.compare);
            
            setScheduledMemberList(sMemList);
            setNonScheduledMemberList(nsMemList);
        }
    }

    useEffect(() => {
        getInitialInfo();
    }, [props.groupInfo, props.updateNumber]);
    
    return (
        <Box>
            <Box sx={{textAlign:'left', marginLeft:labelMargin}}>
                {props.groupInfo?.scheduleGroup && <Typography variant="h6" color="primary.contrastText">{labelName}</Typography>}
                {!props.groupInfo?.scheduleGroup && <Typography variant="subtitle1" color="primary.contrastText">{labelName}</Typography>}                
            </Box>
            <Box sx={{textAlign:'left', marginLeft:labelMargin}}>
                { scheduledMemberList.map((item, index) => (
                    <SLabelMember key={item.member_id + props.groupInfo?.label_id + "scheduled"} label_id={props.groupInfo?.label_id} memberInfo={item} removeMember={onRemove} updateNumber={updateNumber} showAdd={false} showRemove={showRemoveMember}/>
                ))}
                { nonScheduledMemberList.map((item, index) => (
                    <SLabelMember key={item.member_id + props.groupInfo?.label_id + "not-scheduled"} label_id={props.groupInfo?.label_id} memberInfo={item} addMember={onAdd} updateNumber={updateNumber} showAdd={showAddMember} showRemove={false}/>
                ))}
            </Box>
        </Box>
    )

}