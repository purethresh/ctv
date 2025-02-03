"use client"
import { Authenticator } from "@aws-amplify/ui-react";
import { useState } from "react";
import { useEffect } from "react";
import UserInfo from "@/app/lib/UserInfo";
import SNavbar from "@/app/components/SNavbar";
import { Paper, Stack, Box, TextField, Button } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import { useRouter } from 'next/navigation';
import { LinkPageData } from "@/app/db/LinkPageData";
import { MinMemberInfo } from "@/app/lib/MinMemberInfo";


export default function LinkMember() {  
  let [pageData, setPageData] = useState<LinkPageData>(new LinkPageData());
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [isLinkedMember, setIsLinkedMember] = useState<boolean>(false);
  let [searchNumber, setSearchNumber] = useState<string>('');
  let [selectedMember, setSelectedMember] = useState<string>('');
  let [hasMember, setHasMember] = useState<boolean>(false);
  let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);

  const router = useRouter();

  const onSignout = () => {
    // Reset the user info
    const pData = pageData;
    pData.uInfo = new UserInfo();

    setUserInfo(pData.uInfo);
    setPageData(pData);
  }  

  const onMemberSelect = (memberId:string) => {
    setSelectedMember(memberId);
    setHasMember(memberId.length > 0);
  }

  const onNumberChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const pData = pageData;
    const phoneNumber = event.target.value;

    await pData.loadMembersWithPhoneFilter(phoneNumber);

    setSearchNumber(event.target.value);
    setHasMember(false);
    setSelectedMember('');
    setMemberList(pData.memberList);
    setPageData(pData);
  }

  const linkMember = async() => {
    const pData = new LinkPageData();
    await pData.linkMember(selectedMember, userInfo.sub);

    // Now that things are linked, we need to refetch everything.
    pData.clearCache();

    // Jump to the calendar page
    router.replace('/');    
  }

  useEffect(() => {
    const getUserInfo = async() => {
      const pData = pageData;;
      await pData.loadMemberInfo();

      setUserInfo(pData.uInfo);
      setPageData(pData);

      // See if it is already linked
      const isLinked = pData.uInfo.isLinkedMember();
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
                  <Box><SAllMemberSelect isVisible={searchNumber.length > 0} memberList={memberList} onClick={onMemberSelect} /></Box>
                  <Box><Button sx={{display:hasMember ? "block" : "none"}} color="secondary" onClick={linkMember} endIcon={<LinkIcon />}>Link With Member</Button></Box>
                </Stack>
            </Paper>
        </Authenticator>
    </main>
  );


}
