"use client"

import React, { useState, useEffect } from 'react';
import UserInfo from '@/app/lib/UserInfo';
import ChurchLabels from '@/app/lib/ChurchLabels';
import SMyLabels from '@/app/components/SMyLabels';
import SMyOwnedLabels from '@/app/components/SMyOwnedLabels';

// TODO JLS - Here
// On this page show 2 sections
// 1. List of all the labels x is a member of
// 2. List of all the labels x is an owner to
//
// If admin, give the option to switch to a different member so you can see the same for that member
// Goto another page to edit a label that user is an owner of
//
// Show list of members in the same label
// Need a param which is the current user, and we can switch it



export default function LabelPage() {
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());
  let [allLabels, setAllLabels] = useState<ChurchLabels>(new ChurchLabels());
  let [viewingMember, setViewingMember] = useState<string>('');


  useEffect(() => {
    const getUserInfo = async() => {
      const uInfo = new UserInfo();

      await uInfo.loadMemberInfo();
      setUserInfo(uInfo);

      // Start by viewing the info of the current user
      setViewingMember(uInfo.member_id);

      // Get all the labels for the church
      const allLabels = new ChurchLabels();
      await allLabels.fetchAllLabels(uInfo.church_id);
      setAllLabels(allLabels);
    }

    getUserInfo();
  }, []);  

  return (
    <>
      <SMyLabels />
      <SMyOwnedLabels />
    </>
  );
}