"use client";

import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import { useEffect, useState } from "react";
import { Button, Box, Paper } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SMemberInfo from "@/app/components/SMemberInfo";
import { MemberPageData } from "@/app/db/MemberPageData";
import { MinMemberInfo } from "@/app/lib/MinMemberInfo";

export default function MemberPage() {
  let [pageData, setPageData] = useState<MemberPageData>(new MemberPageData());
  let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);
  let [defaultMemberId, setDefaultMemberId] = useState<string>('');
  let [isMemberAdmin, setIsMemberAdmin] = useState<boolean>(false);
  let [memberInfo, setMemberInfo] = useState<MinMemberInfo>(new MinMemberInfo({}));
  let [memberId, setMemberId] = useState<string>('');
  let [isEditing, setIsEditing] = useState<boolean>(false);

  let [updateNumber, setUpdateNumber] = useState<number>(0);  // TODO JLS, remove?

  const onCreateMember = () => {
    const pData = pageData;
    pData.currentMemberInfo = new MinMemberInfo({});
    
    setMemberInfo(pData.currentMemberInfo);
    setIsEditing(true);
    setPageData(pData);
  }    

  const saveMemberInfo = () => {
    // TODO JLS

    setIsEditing(false);

  //   setShouldCreateMember(false);
  //   // Reset back to the current user
  //   // setMemberId(userId);
  //   setUpdateNumber(updateNumber + 1);
  //   setShouldCreateMember(false);
  }

  const onMemberSelected = async (memberId:string) => {
    setIsEditing(false);

    // Load the member
    const pData = pageData;
    await pData.loadCurrentMember(memberId);

    // Set the member Id and member info
    setMemberId(memberId);
    setMemberInfo(pData.currentMemberInfo);

    setPageData(pData);
  }

  const updateUserInfo = async() => {
    const pData = pageData;
    await pData.loadMemberInfo();
    setMemberId(pData.uInfo.member_id);
    setDefaultMemberId(pData.uInfo.member_id);

    // Load data for the current member
    await pData.loadCurrentMember(pData.uInfo.member_id);
    setMemberInfo(pData.currentMemberInfo);

    // Find out if admin
    await pData.loadChurchLabels();
    await pData.loadAdminInfo();
    
    const isAdmin = pData.churchLabels.labelRoot?.isOwner(pData.uInfo.member_id) || false;
    setIsMemberAdmin(isAdmin);

    // If admin, load the list of members
    if (isAdmin) {
      await pData.loadAllMembers();
      setMemberList(pData.memberList);
    }

    setPageData(pData);
  }

  useEffect(() => {
    updateUserInfo();
  }, []);    

  // TODO JLS - fix db calls for this page

  return (
    <Box sx={{textAlign:'center'}}>
      <Paper>
        <SAllMemberSelect isVisible={isMemberAdmin} defaultMemberId={defaultMemberId} onClick={onMemberSelected} updateNumber={updateNumber} memberList={memberList}  />
        <Button color="secondary" endIcon={<PersonAddIcon />} onClick={onCreateMember} style={{display:isMemberAdmin ? 'block' : 'none'}}>Create Member</Button>
      </Paper>
      <SMemberInfo isAdmin={isMemberAdmin} memberInfo={memberInfo} isEditing={isEditing} onMemberCreated={saveMemberInfo} updateNumber={updateNumber}  />
    </Box>
  );
}