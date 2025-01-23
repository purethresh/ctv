"use client"
import { Authenticator } from "@aws-amplify/ui-react";
import { useState } from "react";
import { useEffect } from "react";
import UserInfo from "@/app/lib/UserInfo";
import SNavbar from "@/app/components/SNavbar";
import { Paper, Stack, Box, TextField, Button } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import { API_CALLS, APIHandler } from "@/app/lib/APIHanlder";
import { useRouter } from 'next/navigation';


export default function LinkMember() {  
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [isLinkedMember, setIsLinkedMember] = useState<boolean>(false);
  let [searchNumber, setSearchNumber] = useState<string>('');
  let [selectedMember, setSelectedMember] = useState<string>('');
  let [hasMember, setHasMember] = useState<boolean>(false);

  const router = useRouter();

  const onSignout = () => {
    // Reset the user info
    setUserInfo(new UserInfo());    
  }  

  const onMemberSelect = (memberId:string) => {
    setSelectedMember(memberId);
    setHasMember(memberId.length > 0);
  }

  const onNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchNumber(event.target.value);
    setHasMember(false);
    setSelectedMember('');
  }

  const linkMember = async() => {

    // Link the member with the current user
    const apiHandler = new APIHandler();
    const memberParams = { member_id: selectedMember, sub: userInfo.sub };
    const mResult = await apiHandler.createData(API_CALLS.memberLink, memberParams);

    // Jump to the calendar page
    router.replace('/');    
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

  return (
    <main>
        <Authenticator>
            <SNavbar userInfo={userInfo} onSignout={onSignout} />
            <Paper sx={{display: isLinkedMember ? 'none' : 'block'}}>
                <Stack spacing={1}>
                  <Box>Instructions here</Box>
                  <Box>
                    <Stack direction="row" spacing={1}>
                      <TextField color="secondary" required label="Phone Number" onChange={onNumberChange} sx={{ paddingLeft: '10px', paddingRight:'5px', paddingTop:'8px'}}/>
                    </Stack>
                  </Box>
                  <Box><SAllMemberSelect churchId={userInfo.church_id} isVisible={searchNumber.length > 0} useFilter={true} phoneFilter={searchNumber} onClick={onMemberSelect} /></Box>
                  <Box><Button sx={{display:hasMember ? "block" : "none"}} color="secondary" onClick={linkMember} endIcon={<LinkIcon />}>Link With Member</Button></Box>
                </Stack>
            </Paper>
        </Authenticator>
    </main>
  );


}
