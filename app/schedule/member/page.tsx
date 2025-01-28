"use client";

import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import ChurchLabels from "@/app/lib/ChurchLabels";
import UserInfo from "@/app/lib/UserInfo";
import { useEffect, useState } from "react";
import { Button, Box, Paper } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SMemberInfo from "@/app/components/SMemberInfo";

export default function MemberPage() {
  let [shouldCreateMember, setShouldCreateMember] = useState<boolean>(false);
  let [userId, setUserId] = useState<string>('');
  let [churchId, setChurchId] = useState<string>('');
  let [isMemberAdmin, setIsMemberAdmin] = useState<boolean>(false);
  let [memberId, setMemberId] = useState<string>('');
  let [updateNumber, setUpdateNumber] = useState<number>(0);

  const onCreateMember = () => {
    setShouldCreateMember(true);
  }

  const onMemberCreated = () => {
    setShouldCreateMember(false);
    // Reset back to the current user
    setMemberId(userId);
    setUpdateNumber(updateNumber + 1);
    setShouldCreateMember(false);
  }

  const onMemberSelected = (memberId:string) => {
    setMemberId(memberId);
  }

  const updateUserInfo = async() => {
    // Get the basic User Info
    const uInfo = new UserInfo();
    await uInfo.loadMemberInfo();
    setUserId(uInfo.member_id);
    setChurchId(uInfo.church_id);
    setMemberId(uInfo.member_id);

    // We need the root label ID
    const cLabels = new ChurchLabels();
    await cLabels.fetchAllLabels(uInfo.church_id);

    if (cLabels.labelRoot) {
      const rootId = cLabels.labelRoot.label_id;

      // Find out if the user is a member admin
      await uInfo.loadMemberAdminInfo(rootId);
      setIsMemberAdmin(uInfo.isMemberAdmin);
    }
  }

  useEffect(() => {
    updateUserInfo();
  }, []);    

  // TODO JLS - fix db calls for this page

  return (
    <Box sx={{textAlign:'center'}}>
      <Paper>
        <SAllMemberSelect churchId={churchId} isVisible={isMemberAdmin} defaultMemberId={userId} onClick={onMemberSelected} updateNumber={updateNumber} useFilter={false}  />
        <Button color="secondary" endIcon={<PersonAddIcon />} onClick={onCreateMember} style={{display:isMemberAdmin ? 'block' : 'none'}}>Create Member</Button>
      </Paper>
      <SMemberInfo isAdmin={isMemberAdmin} userId={userId} memberId={memberId} isCreating={shouldCreateMember} onMemberCreated={onMemberCreated} churchId={churchId} updateNumber={updateNumber}  />
    </Box>
  );
}