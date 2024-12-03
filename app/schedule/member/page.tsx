"use client";

import SAllMemberSelect from "@/app/components/SAllMemberSelect";
import ChurchLabels from "@/app/lib/ChurchLabels";
import { MinMemberInfo } from "@/app/lib/MinMemberInfo";
import UserInfo from "@/app/lib/UserInfo";
import { useEffect, useState } from "react";

export default function MemberPage() {
  let [userId, setUserId] = useState<string>('');
  let [churchId, setChurchId] = useState<string>('');
  let [isMemberAdmin, setIsMemberAdmin] = useState<boolean>(false);

  /*  
    TODO JLS HERE

    - Find out if member of church-member
    - - If so, then show all members.
    - - Give access to create new member
    - If not, then show only self
    - User has access to edit self (others if admin)

  */

  const updateUserInfo = async() => {
    // Get the basic User Info
    const uInfo = new UserInfo();
    await uInfo.loadMemberInfo();
    setUserId(uInfo.member_id);
    setChurchId(uInfo.church_id);

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
    Member Page
    </>  
  );
}