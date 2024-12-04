import { Box } from "@mui/material";
import { SMemberInfoProp } from "../props/SMemberInfoProp";

export default function SMemberInfo(props:SMemberInfoProp) {

    return (
        <>
        <Box>
            Member ID (Hidden)
            First Name
            Last Name
            Phone (Different Table) - Different Control
            Email (Different Table) - Different Control
            Address (Different Table) - Different Control
            Notes
        </Box>
        <br />
        </>
    );



}