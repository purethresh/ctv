"use client";

import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import { useEffect, useState } from "react";
import { Button, Box, Paper } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SMemberInfo from "@/app/components/SMemberInfo";
import { MemberPageData } from "@/app/db/MemberPageData";
import { MinMemberInfo } from "@/app/lib/MinMemberInfo";
import { MemberPhoneInfo } from "@/app/lib/MemberPhoneInfo";
import { MemberEmailInfo } from "@/app/lib/MemberEmailInfo";
import { MemberAddressInfo } from "@/app/lib/MemberAddressInfo";
import { v4 } from 'uuid';

export default function MemberPage() {
  let [pageData, setPageData] = useState<MemberPageData>(new MemberPageData());
  let [memberList, setMemberList] = useState<MinMemberInfo[]>([]);
  let [defaultMemberId, setDefaultMemberId] = useState<string>('');
  let [isMemberAdmin, setIsMemberAdmin] = useState<boolean>(false);
  let [memberInfo, setMemberInfo] = useState<MinMemberInfo>(new MinMemberInfo({}));
  let [phoneList, setPhoneList] = useState<MemberPhoneInfo[]>([]);
  let [emailList, setEmailList] = useState<MemberEmailInfo[]>([]);
  let [addressList, setAddressList] = useState<MemberAddressInfo[]>([]);
  let [isEditing, setIsEditing] = useState<boolean>(false);

  // Sets everything to edit, and creates a new member info object
  const onViewCreateMember = () => {
    const pData = pageData;
    pData.currentMemberInfo = new MinMemberInfo({});
    pData.currentPhoneList = [];
    pData.currentAddressList = [];
    pData.currentEmailList = [];

    setPhoneList(pData.currentPhoneList);
    setAddressList(pData.currentAddressList);
    setEmailList(pData.currentEmailList);
    setMemberInfo(pData.currentMemberInfo);

    setIsEditing(true);
    setPageData(pData);
  }

  const onCancel = async () => {
    const pData = pageData;
    setIsEditing(false);   
    setMemberInfo(pData.currentMemberInfo); 
  }

  const onSave = async (mInfo:MinMemberInfo, phoneList:MemberPhoneInfo[], addressList:MemberAddressInfo[], emailList:MemberEmailInfo[]) => {
    const pData = pageData;

    // const mData = { ...mInfo, church_id: pData.uInfo.church_id };
    const mData = { first: mInfo.first, last: mInfo.last, gender:mInfo.gender, member_id: mInfo.member_id, church_id: pData.uInfo.church_id, notes: mInfo.notes, sub: mInfo.sub };
    
    // Create or save the member
    if (mInfo.member_id === '') {
      mData.member_id = v4();
      await pData.createMember(mData);
    } else {
      await pData.updateMember(mData);
    }

    // Save the phone list
    await pData.updatePhoneList(phoneList, mInfo.member_id);

    // Save the email list
    await pData.updateEmailList(emailList, mInfo.member_id);

    // Save the address list
    await pData.updateAddressList(addressList, mInfo.member_id);

    // Reload everything
    const memberId = pData.currentMemberInfo.member_id;
    await onMemberSelected(memberId);
  }

  const onRemoveLink = async (memberId:string) => {
    const pData = pageData;
    await pData.unlinkMember(memberId);    
    setPageData(pData);
  }

  const onMemberSelected = async (memberId:string) => {
    setIsEditing(false);

    // Load the member
    const pData = pageData;
    await pData.loadCurrentMember(memberId);

    await pData.loadPhoneList(pData.currentMemberInfo.member_id);
    await pData.loadEmailList(pData.currentMemberInfo.member_id);
    await pData.loadAddressList(pData.currentMemberInfo.member_id);

    setPhoneList(pData.currentPhoneList);
    setAddressList(pData.currentAddressList);
    setEmailList(pData.currentEmailList);

    // Set the member Id and member info
    setMemberInfo(pData.currentMemberInfo);

    setPageData(pData);
  }

  const updateUserInfo = async() => {
    const pData = pageData;
    await pData.loadMemberInfo();
    setDefaultMemberId(pData.uInfo.member_id);

    // Load data for the current member
    await pData.loadCurrentMember(pData.uInfo.member_id);

    await pData.loadPhoneList(pData.currentMemberInfo.member_id);
    await pData.loadEmailList(pData.currentMemberInfo.member_id);
    await pData.loadAddressList(pData.currentMemberInfo.member_id);

    setPhoneList(pData.currentPhoneList);
    setAddressList(pData.currentAddressList);
    setEmailList(pData.currentEmailList);
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

  return (
    <Box sx={{textAlign:'center'}}>
      <Paper>
        <SAllMemberSelect isVisible={isMemberAdmin} defaultMemberId={defaultMemberId} onClick={onMemberSelected} memberList={memberList}  />
        <Button color="secondary" endIcon={<PersonAddIcon />} onClick={onViewCreateMember} style={{display:isMemberAdmin ? 'block' : 'none'}}>Create Member</Button>
      </Paper>
      <SMemberInfo phoneList={phoneList} emailList={emailList} addressList={addressList} isAdmin={isMemberAdmin} memberInfo={memberInfo} isEditing={isEditing} onCancel={onCancel} onRemoveLink={onRemoveLink} saveMemberInfo={onSave} />
    </Box>
  );
}