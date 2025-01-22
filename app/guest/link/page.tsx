"use client"
import { Authenticator } from "@aws-amplify/ui-react";
import { useState } from "react";
import { useEffect } from "react";
import UserInfo from "@/app/lib/UserInfo";
import SNavbar from "@/app/components/SNavbar";
import { Paper, Stack, Box, TextField, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';


export default function LinkMember() {  
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [isLinkedMember, setIsLinkedMember] = useState<boolean>(false);

  const onSignout = () => {
    // Reset the user info
    setUserInfo(new UserInfo());
  }  

  useEffect(() => {
    const getUserInfo = async() => {
      const uInfo = new UserInfo();

      await uInfo.loadMemberInfo();
      setUserInfo(uInfo);

      // See if it is already linked
      const isLinked = uInfo.isLinkedMember();
      setIsLinkedMember(isLinked);
    }    

    getUserInfo();
  }, []);

  // TODO JLS - HERE
  // Otherwise, show text box for phone number
  // Then a select of all the users with that phone number (and not already linked)

  return (
    <main>
        <Authenticator>
            <SNavbar userInfo={userInfo} onSignout={onSignout} />
            <Paper sx={{display: isLinkedMember ? 'none' : 'block'}}>
                <Stack spacing={1}>
                  <Box>Instructions here</Box>
                  <Box>
                    <Stack direction="row" spacing={1}>
                      <TextField color="secondary" required label="Phone Number" sx={{ paddingLeft: '10px', paddingRight:'5px', paddingTop:'8px'}}/>
                      <Button color="secondary" endIcon={<SearchIcon />}>Search</Button>
                    </Stack>
                  </Box>
                  <Box>List of members</Box>
                  <Box><Button color="secondary" endIcon={<LinkIcon />}>Link With Member</Button></Box>
                </Stack>
            </Paper>
        </Authenticator>
    </main>
  );


}
