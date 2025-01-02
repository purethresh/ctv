import { SServiceScheduleProps } from '../props/SServiceScheduleProps';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ChurchLabels from '../lib/ChurchLabels';
import SLabelGroup from './SLabelGroup';
import { LabelInfo } from '../lib/LabelInfo';
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { ChurchSchedule } from '../lib/ChurchSchedule';
import { ServiceInfo } from '../lib/ServiceInfo';
import { Typography } from "@mui/material";
import { text } from 'stream/consumers';

// Custom day Render
export default function SServiceSchedule(props:SServiceScheduleProps) {
    let [serviceInfo, setServiceInfo] = useState<ServiceInfo>(new ServiceInfo({}));
    let [shouldShowName, setShouldShowName] = useState<boolean>(false);
    let [shouldShowInfo, setShouldShowInfo] = useState<boolean>(false);
    let [groupList, setGroupList] = useState<LabelInfo[]>([]);

  useEffect(() => {
    const updateShowElements = async () => {

        // Set the service info
        const sInfo = props.serviceInfo || new ServiceInfo({});
        setServiceInfo(sInfo);

        setShouldShowName(sInfo.name.length > 0);
        setShouldShowInfo(sInfo.info.length > 0);

        // Create new church label info
        const lblInfo = new ChurchLabels();

        // Load the labels
        const churchId = sInfo.church_id;
        await lblInfo.fetchAllLabels(churchId);

        // Load the scheduled labels
        await lblInfo.fetchScheduledLabels(sInfo.service_id);

        // Get those scheduled for this service
        await sInfo.fetchScheduledMembers(lblInfo);        
        
        // Create label groups
        const groups = lblInfo.getLabelGroups();
        setGroupList(groups);
    }
    
    updateShowElements();
  }, [props.serviceInfo]);

    return (
        <Box>
          <Paper>
            <Box bgcolor='secondary.main' style={{display:shouldShowName ? 'block' : 'none', width:'100%', textAlign:'center'}}>
              <Typography variant="h4" color='secondary.contrastText'>{serviceInfo.name}</Typography>
            </Box>
            <Box bgcolor='primary.dark' style={{display:shouldShowInfo ? 'block' : 'none', width:'100%', textAlign:'center'}}>
              <Typography variant="subtitle1" color='secondary.contrastText'>{serviceInfo.info}</Typography>
            </Box>
            {groupList.map((item, index) => (
              <SLabelGroup key={item.label_id} groupInfo={item} />
            ))}
          </Paper>
        </Box>
    );
}