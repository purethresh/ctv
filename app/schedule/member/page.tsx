"use client";

import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import ChurchLabels from "@/app/lib/ChurchLabels";
import UserInfo from "@/app/lib/UserInfo";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SMemberInfo from "@/app/components/SMemberInfo";

export default function MemberPage() {
  let [userId, setUserId] = useState<string>('');
  let [churchId, setChurchId] = useState<string>('');
  let [isMemberAdmin, setIsMemberAdmin] = useState<boolean>(false);
  let [memberId, setMemberId] = useState<string>('');

  /*  
    TODO JLS HERE
    - Creating SMembersInfo.tsx
    - - Show member info
    - - Create control to show phone numbers
    - - Create control to show email addresses
    - - Create control to show addresses

    - Make edit version of all these
  */

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

  return (
    <>
      <SAllMemberSelect churchId={churchId} isVisible={isMemberAdmin} showAddButton={false}  />
      <Button endIcon={<PersonAddIcon />} style={{display:isMemberAdmin ? 'block' : 'none'}}>Create Member</Button>
      <SMemberInfo isAdmin={isMemberAdmin} memberId={memberId}  />
    </>  
  );
}