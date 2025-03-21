import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo } from "../lib/LabelInfo";
import SScheduledLabel from "./SScheduledLabel";
import { FullMemberInfo } from "../lib/FullMemberInfo";

export default function SLabelGroup(props:SLabelGroupProps) {
    let [groupLabels, setGroupLabels] = useState<LabelInfo>();
    let [childLabels, setChildLabels] = useState<LabelInfo[]>([]);
    let [showAddMember, setShowAddMember] = useState<boolean>(props.showAddMember || false);
    let [showRemoveMember, setShowRemoveMember] = useState<boolean>(props.showRemoveMember || false);
    let [showNonScheduledMembers, setShowNonScheduledMembers] = useState<boolean>(true);
    let [memberMap, setMemberMap] = useState<Map<string, FullMemberInfo>>(new Map<string, FullMemberInfo>());
    let [serviceId, setServiceId] = useState<string>(props.serviceId || '');
    let [serviceDateStr, setServiceDateStr] = useState<string>(props.serviceDate || '');
    

    const addMember = (memberInfo:FullMemberInfo, labelInfo:LabelInfo) => {
        if (props.onAddMember) {
            props.onAddMember(memberInfo, labelInfo);
        }
    }

    const removeMember  = (memberInfo:FullMemberInfo, labelInfo:LabelInfo) => {        
        if (props.onRemoveMember) {           
            props.onRemoveMember(memberInfo, labelInfo);
        }
    }

    const getInitialInfo = async() => {        
        if (props.groupInfo !== undefined) {
            setShowAddMember(props.showAddMember || false);
            setShowRemoveMember(props.showRemoveMember || false);
            setServiceDateStr(props.serviceDate || '');

            if (props.members !== undefined) {
                setMemberMap(props.members);
            }

            if (props.serviceId !== undefined) {
                setServiceId(props.serviceId);
            }
            
            var sScheduled = showNonScheduledMembers;
            if (props.showNonScheduledMembers !== undefined) {
                sScheduled = props.showNonScheduledMembers;
            }
            setShowNonScheduledMembers(sScheduled);
            
            // If this is a group, then use the children
            var lst:LabelInfo[] = [];
            if (props.groupInfo.scheduleGroup) {
                setGroupLabels(props.groupInfo);
                lst = props.groupInfo.childLabels;
            }
            else {
                lst.push(props.groupInfo);
            }

            setChildLabels(lst);
        }        
    }

    useEffect(() => {
        getInitialInfo();
    }, [props.groupInfo]);

    return (
        <Box>
            <SScheduledLabel key={groupLabels?.label_id + "_label"} groupInfo={groupLabels} serviceDate={serviceDateStr} showAddMember={false} showRemoveMember={false} members={memberMap} serviceId={serviceId} showNonScheduledMembers={showNonScheduledMembers} />
            {childLabels.map((item, index) => ( 
                <SScheduledLabel key={item.label_id + "_label"} groupInfo={item} serviceDate={serviceDateStr} onAddMember={addMember} onRemoveMember={removeMember} showAddMember={showAddMember} showRemoveMember={showRemoveMember} members={memberMap} serviceId={serviceId} showNonScheduledMembers={showNonScheduledMembers} />
            ))}
        </Box>
    );
}