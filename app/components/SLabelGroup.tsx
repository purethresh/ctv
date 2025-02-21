import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo } from "../lib/LabelInfo";
import SScheduledLabel from "./SScheduledLabel";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import { FullMemberInfo } from "../lib/FullMemberInfo";

export default function SLabelGroup(props:SLabelGroupProps) {
    let [groupLabels, setGroupLabels] = useState<LabelInfo>();
    let [childLabels, setChildLabels] = useState<LabelInfo[]>([]);
    let [updateNumber, setUpdateNumber] = useState<number>(props.updateNumber || 0);
    let [showAddMember, setShowAddMember] = useState<boolean>(props.showAddMember || false);
    let [showRemoveMember, setShowRemoveMember] = useState<boolean>(props.showRemoveMember || false);
    let [memberMap, setMemberMap] = useState<Map<string, FullMemberInfo>>(new Map<string, FullMemberInfo>());
    let [serviceId, setServiceId] = useState<string>('');
    

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

    const needsUpdate = () => {
        setUpdateNumber(props.updateNumber || 0);
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

    useEffect(() => {
        needsUpdate();
    }, [props.updateNumber]);

    return (
        <Box>
            <SScheduledLabel key={groupLabels?.label_id + "_label"} groupInfo={groupLabels} updateNumber={updateNumber} showAddMember={false} showRemoveMember={false} members={memberMap} serviceId={serviceId} />
            {childLabels.map((item, index) => ( 
                <SScheduledLabel key={item.label_id + "_label"} groupInfo={item} updateNumber={updateNumber} onAddMember={addMember} onRemoveMember={removeMember} showAddMember={showAddMember} showRemoveMember={showRemoveMember} members={memberMap} serviceId={serviceId} />
            ))}
        </Box>
    );
}