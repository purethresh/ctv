import { Box } from "@mui/material";
import { SMemberLabelProps } from "../props/SMemberLabelProps";
import { useEffect, useState } from 'react';
import { ScheduleStatus } from "../lib/ScheduleStatus";

export default function SLabelMember(props:SMemberLabelProps) {
    const memberColor:string = '#888888';
    const scheduledColor:string = '#ADD8E6';
    const blockedOutColor:string = '#FF7F7F';
    const recommendedColor:string = '#90EE90';

    let [memberId, setMemberId] = useState<string>('');
    let [fullName, setFullName] = useState<string>('');
    let [showStatus, setShowStatus] = useState<boolean>(props.showStatus || false);
    let [memberStatus, setMemberStatus] = useState<ScheduleStatus>(ScheduleStatus.member);
    let [statusColor, setStatusColor] = useState<string>(memberColor);

    let [showAdd, setShowAdd] = useState<boolean>(props.showAdd || false);
    let [showRemove, setShowRemove] = useState<boolean>(props.showRemove || false);

    const setupUserInfo = () => {
        if (props.memberInfo !== undefined) {
            const mInfo = props.memberInfo;
            setMemberId(props.memberInfo.member_id);

            // Set the name
            var nm = mInfo.first;
            if (mInfo.last.length > 0) {
                nm = mInfo.first + ' ' + mInfo.last;
            }
            setFullName(nm);

            // Set the status
            const sStatus = props.showStatus || false;
            setShowStatus(sStatus);

            if (sStatus) {
                if (mInfo.scheduledStatus === ScheduleStatus.blockedOut) {
                    setStatusColor(blockedOutColor);
                } else if (mInfo.scheduledStatus === ScheduleStatus.recommended) {
                    setStatusColor(recommendedColor);
                } else if (mInfo.scheduledStatus === ScheduleStatus.scheduled) {
                    setStatusColor(scheduledColor);
                } else {
                    setStatusColor(memberColor);
                }
            }
        }
    }

    useEffect(() => {
        setupUserInfo();
    }, [props.memberInfo, props.updateNumber]);

    return (
        <Box sx={{backgroundColor: statusColor, display: 'inline-block', padding: '5px', margin: '5px', borderRadius: '15px'}}>
            {fullName}
        </Box>
    );



}