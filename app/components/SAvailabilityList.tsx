"use client";

import { SAvailabilityListProp} from "@/app/props/SAvailabilityListProp";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { AvailabilityInfo } from "../lib/AvailabilityInfo";

export default function SAvailabilityList(props:SAvailabilityListProp) {
    let [blockedOutList, setBlockedOutList] = useState<AvailabilityInfo[]>([]);

    const onRemoveBlockedDate = (aInfo:AvailabilityInfo) => {
        if (props.onRemove !== undefined) {
            props.onRemove(aInfo);
        }
    }

    const updateList = () => {
        if (props.blockedList === undefined) {
            setBlockedOutList([]);
        }
        else {
            setBlockedOutList(props.blockedList);
        }
    }

    useEffect(() => {
        updateList();
    }, [props.blockedList]);

    return (
        <Box>
            <List>
                {blockedOutList.map((item, index) => {
                    return (
                        <ListItem key={item.availability_id + "_list"}>
                            <ListItemText primary={item.blockedAsDateStr} />
                            <ListItemButton onClick={() => {onRemoveBlockedDate(item);}}>
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}