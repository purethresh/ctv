import { SLabelGroupProps } from "../props/SLabelGroupProps";
import { Box, FormLabelPropsColorOverrides } from "@mui/material";
import { useEffect, useState } from 'react';
import { LabelInfo, ILabelInfo } from "../lib/LabelInfo";
import { MinMemberInfo } from "../lib/MinMemberInfo";
import SLabelMember from "./SLabelMember";
import { ScheduleStatus } from "../lib/ScheduleStatus";

export default function SScheduledLabel(props:SLabelGroupProps) {
    let [labelName, setLabelName] = useState<string>(props.groupInfo?.labelName || '');
    let [scheduledMemberList, setScheduledMemberList] = useState<MinMemberInfo[]>([]);
    let [nonScheduledMemberList, setNonScheduledMemberList] = useState<MinMemberInfo[]>([]);

    const getInitialInfo = async() => {
        if (props.groupInfo !== undefined) {
            const lbl = props.groupInfo;
            setLabelName(lbl.labelName);

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
            
            setScheduledMemberList(sMemList);
            setNonScheduledMemberList(nsMemList);
        }
    }

    useEffect(() => {
        getInitialInfo();
    }, [props.groupInfo, props.updateNumber]);
    
    return (
        <Box>
            {labelName} <br />
            { scheduledMemberList.map((item, index) => (
                <SLabelMember key={item.member_id + props.groupInfo?.label_id + "scheduled"} memberInfo={item}/>
            ))}
            { nonScheduledMemberList.map((item, index) => (
                <SLabelMember key={item.member_id + props.groupInfo?.label_id + "not-scheduled"} memberInfo={item}/>
            ))}
        </Box>
    )

}