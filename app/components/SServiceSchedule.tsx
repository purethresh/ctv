import { SServiceScheduleProps } from '../props/SServiceScheduleProps';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ChurchLabels from '../lib/ChurchLabels';

// TODO JLS HERE
//
// 1. Get ALL labels for the church. Make a map, so we know the parent (Group by parent)
// 2. Get the scheduled labels
// 3. Create a label for each group (and pass in the label info)


// Custom day Render
export default function SServiceSchedule(props:SServiceScheduleProps) {
    let [shouldShowName, setShouldShowName] = useState<boolean>(false);
    let [shouldShowInfo, setShouldShowInfo] = useState<boolean>(false);
    let [churchLabelInfo, setChurchLabelInfo] = useState<ChurchLabels>(new ChurchLabels());

  useEffect(() => {
    const updateShowElements = async () => {
        setShouldShowName(props.serviceName != undefined && props.serviceName.length > 0);
        setShouldShowInfo(props.serviceInfo != undefined && props.serviceInfo.length > 0);

        // Create new church label info
        const lblInfo = new ChurchLabels();

        // Load the labels
        await lblInfo.fetchAllLabels(props.churchId || '');

        // Load the scheduled labels
        await lblInfo.fetchScheduledLabels(props.serviceId || '');
        setChurchLabelInfo(lblInfo);

        // TODO JLS, need to create the groups.
        // Then render a ScheduledLabel component for each group
    }
    
    updateShowElements();
  }, [props.serviceName, props.serviceInfo, props.churchId]);

    return (
        <Box>
            <Box style={{display:shouldShowName ? 'block' : 'none'}}>{props.serviceName}</Box>
            <Box style={{display:shouldShowInfo ? 'block' : 'none'}}>{props.serviceInfo}</Box>
            <Box>List of Labels</Box>
        </Box>            
    );
}