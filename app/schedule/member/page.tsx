"use client";

import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import ChurchLabels from "@/app/lib/ChurchLabels";
import UserInfo from "@/app/lib/UserInfo";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SMemberInfo from "@/app/components/SMemberInfo";

// TODO JLS - Here
// Need to get the member id from the selected member
// Then for the member info, need to set the member id from the select.
// But if is creating, then have the control create the member id

export default function MemberPage() {
  let [shouldCreateMember, setShouldCreateMember] = useState<boolean>(false);
  let [userId, setUserId] = useState<string>('');
  let [churchId, setChurchId] = useState<string>('');
  let [isMemberAdmin, setIsMemberAdmin] = useState<boolean>(false);
  let [memberId, setMemberId] = useState<string>('');

  const onCreateMember = () => {
    setShouldCreateMember(true);
  }

  const onMemberCreated = () => {
    setShouldCreateMember(false);
    // Reset back to the current user
    setMemberId(userId);
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

  return (
    <>
      <SAllMemberSelect churchId={churchId} isVisible={isMemberAdmin} defaultMemberId={userId} onClick={onMemberSelected}  />
      <Button endIcon={<PersonAddIcon />} onClick={onCreateMember} style={{display:isMemberAdmin ? 'block' : 'none'}}>Create Member</Button>
      <SMemberInfo isAdmin={isMemberAdmin} userId={userId} memberId={memberId} isCreating={shouldCreateMember} onMemberCreated={onMemberCreated} churchId={churchId}  />
    </>  
  );
}