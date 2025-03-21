import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo, ILabelInfo } from "../lib/LabelInfo";
import SLabelMember from "./SLabelMember";
import { Typography } from "@mui/material";
import { FullMemberInfo } from "../lib/FullMemberInfo";

export default function SScheduledLabel(props:SLabelGroupProps) {

    const DEFAULT_MAX_SCHEDULED = 100;

    let [labelMargin, setLabelMargin] = useState<number>(2);
    let [labelName, setLabelName] = useState<string>(props.groupInfo?.labelName || '');
    let [labelInfo, setLabelInfo] = useState<LabelInfo>(props.groupInfo || new LabelInfo({}));
    let [scheduledMemberList, setScheduledMemberList] = useState<FullMemberInfo[]>([]);
    let [nonScheduledMemberList, setNonScheduledMemberList] = useState<FullMemberInfo[]>([]);
    let [scheduledNumber, setScheduledNumber] = useState<number>(DEFAULT_MAX_SCHEDULED);
    let [showAddMember, setShowAddMember] = useState<boolean>(props.showAddMember || false);
    let [showRemoveMember, setShowRemoveMember] = useState<boolean>(props.showRemoveMember || false);
    let [showNonScheduledMembers, setShowNonScheduledMembers] = useState<boolean>(props.showNonScheduledMembers || false);
    let [memberMap, setMemberMap] = useState<Map<string, FullMemberInfo>>(new Map<string, FullMemberInfo>());
    let [serviceId, setServiceId] = useState<string>(props.serviceId || '');
    let [serviceDateStr, setServiceDateStr] = useState<string>(props.serviceDate || '');
    
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
            setServiceDateStr(props.serviceDate || '');

            var currentMembers = memberMap;
            if (props.members !== undefined) {
                currentMembers = props.members;
                setMemberMap(props.members);
            }

            var sId = serviceId;
            if (props.serviceId !== undefined) {
                sId = props.serviceId;
                setServiceId(props.serviceId);
            }

            var sNonScheduledMembers = true;
            if (props.showNonScheduledMembers !== undefined) {
                sNonScheduledMembers = props.showNonScheduledMembers;
            }
            setShowNonScheduledMembers(sNonScheduledMembers);

            const lbl = props.groupInfo;
            setLabelName(lbl.labelName);
            setLabelInfo(lbl);

            if (lbl.scheduleGroup) {
                setLabelMargin(2);
            }
            else {
                setLabelMargin(4);
            }

            // Get the members
            var minScheduled = DEFAULT_MAX_SCHEDULED;
            const sMemList:FullMemberInfo[] = [];
            var nsMemList:FullMemberInfo[] = [];
            lbl.memberSet.forEach((value) => {
                const mInfo = currentMembers.get(value);
                if (mInfo !== undefined) {
                    minScheduled = Math.min(minScheduled, mInfo.getScheduledNumber());
                    if (mInfo.isScheduledForLabel(sId, lbl.label_id)) {
                        sMemList.push(mInfo);
                    }
                    else {
                        nsMemList.push(mInfo);
                    }
                }
            });

            if (!sNonScheduledMembers) {
                nsMemList = [];
            }

            // Sort Scheduled Members (by name)
            sMemList.sort(FullMemberInfo.sortByName);

            // Sort non scheduled members
            nsMemList.sort( (a, b) => {
                var aSched = a.getScheduledNumber();
                var bSched = b.getScheduledNumber();

                // If both less than minScheduled, then sort by name
                if (aSched <= minScheduled && bSched <= minScheduled) {
                    return FullMemberInfo.sortByName(a, b);
                }
                else if (aSched > minScheduled && bSched <= minScheduled) {
                    // Both are greater than minScheduled
                    return FullMemberInfo.sortByName(a, b);
                }
                else {
                    // Otherwise, return the one that is smaller than minScheduled
                    return aSched - bSched;
                }
            });
            
            setScheduledNumber(minScheduled);
            setScheduledMemberList(sMemList);
            setNonScheduledMemberList(nsMemList);
        }
    }

    useEffect(() => {
        getInitialInfo();
    }, [props.groupInfo]);
    
    return (
        <Box>
            <Box sx={{textAlign:'left', marginLeft:labelMargin}}>
                {props.groupInfo?.scheduleGroup && <Typography variant="h6" color="primary.contrastText">{labelName}</Typography>}
                {!props.groupInfo?.scheduleGroup && <Typography variant="subtitle1" color="primary.contrastText">{labelName}</Typography>}                
            </Box>
            <Box sx={{textAlign:'left', marginLeft:labelMargin}}>
                { scheduledMemberList.map((item, index) => (
                    <SLabelMember key={item.member_id + props.groupInfo?.label_id + "scheduled"} label_id={props.groupInfo?.label_id} service_id={serviceId} serviceDate={serviceDateStr} memberInfo={item} removeMember={onRemove} showAdd={false} showRemove={showRemoveMember} maxScheduledForRecommendation={scheduledNumber}/>
                ))}
                { nonScheduledMemberList.map((item, index) => (
                    <SLabelMember key={item.member_id + props.groupInfo?.label_id + "not-scheduled"} label_id={props.groupInfo?.label_id} service_id={serviceId} serviceDate={serviceDateStr} memberInfo={item} addMember={onAdd} showAdd={showAddMember} showRemove={false} maxScheduledForRecommendation={scheduledNumber}/>
                ))}
            </Box>
        </Box>
    )

}