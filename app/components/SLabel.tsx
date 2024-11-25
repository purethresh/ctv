import { SLabelProps } from "../props/SLabelProps";
import { Box, Chip } from "@mui/material";

export default function SLabel(props:SLabelProps) {

    return (
        <>
            <Box component="section"
                style={{
                    display:'inline-flex',
                    borderRadius:6
                }}
                sx={{bgcolor:'primary.main'}}>
                {props.labelInfo?.labelName}
            </Box>
            {props.labelInfo?.scheduled.map((item, index) => (
                <Chip key={item.member_id} label={item.first + " " + item.last} />
            )) }
            <br />
        </>
    );



}