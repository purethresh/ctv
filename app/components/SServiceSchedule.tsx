import { SServiceScheduleProps } from '../props/SServiceScheduleProps';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import SLabelGroup from './SLabelGroup';
import { LabelInfo } from '../lib/LabelInfo';
import { Paper } from '@mui/material';
import { ServiceInfo } from '../lib/ServiceInfo';
import { Typography } from "@mui/material";

// Custom day Render
export default function SServiceSchedule(props:SServiceScheduleProps) {
    let [serviceInfo, setServiceInfo] = useState<ServiceInfo>(new ServiceInfo({}));
    let [serviceTime, setServiceTime] = useState<string>('');
    let [shouldShowName, setShouldShowName] = useState<boolean>(false);
    let [shouldShowInfo, setShouldShowInfo] = useState<boolean>(false);
    let [groupList, setGroupList] = useState<LabelInfo[]>([]);

  useEffect(() => {
    const updateShowElements = async () => {

        // Set the service info
        const sInfo = props.serviceInfo || new ServiceInfo({});
        setServiceInfo(sInfo);

        // Set the service time as a string
        const sTime = sInfo.serviceAsDate();
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        const str = new Intl.DateTimeFormat('en-US', options).format(sTime);

        setServiceTime(str);

        setShouldShowName(sInfo.name.length > 0);
        setShouldShowInfo(sInfo.info.length > 0);

        const groups = serviceInfo.churchLabels.getLabelGroups();
        setGroupList(groups);
    }
    
    updateShowElements();
  }, [props.serviceInfo]);

    return (
        <Box>
          <Paper>
            <Box bgcolor='secondary.main' style={{display:shouldShowName ? 'block' : 'none', width:'100%', textAlign:'center'}}>
              <Typography variant="h4" color='secondary.contrastText'>{serviceTime} - {serviceInfo.name}</Typography>
            </Box>
            <Box bgcolor='primary.dark' style={{display:shouldShowInfo ? 'block' : 'none', width:'100%', textAlign:'center'}}>
              <Typography variant="subtitle1" color='secondary.contrastText'>{serviceInfo.info}</Typography>
            </Box>
            {groupList.map((item, index) => (
              <SLabelGroup key={item.label_id + "_label_group"} groupInfo={item} />
            ))}
          </Paper>
        </Box>
    );
}