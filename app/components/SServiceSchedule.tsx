import { SServiceScheduleProps } from '../props/SServiceScheduleProps';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ChurchLabels from '../lib/ChurchLabels';
import SLabelGroup from './SLabelGroup';
import { LabelInfo } from '../lib/LabelInfo';

// Custom day Render
export default function SServiceSchedule(props:SServiceScheduleProps) {
    let [shouldShowName, setShouldShowName] = useState<boolean>(false);
    let [shouldShowInfo, setShouldShowInfo] = useState<boolean>(false);
    let [groupList, setGroupList] = useState<LabelInfo[]>([]);

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
        
        // Create label groups
        const groups = lblInfo.getLabelGroups();
        setGroupList(groups);
    }
    
    updateShowElements();
  }, [props.serviceName, props.serviceInfo, props.churchId]);

    return (
        <Box>
            <Box style={{display:shouldShowName ? 'block' : 'none'}}>{props.serviceName}</Box>
            <Box style={{display:shouldShowInfo ? 'block' : 'none'}}>{props.serviceInfo}</Box>
            {groupList.map((item, index) => (
              <SLabelGroup key={item.label_id} groupInfo={item} />
            ))}

        </Box>            
    );
}