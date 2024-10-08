"use client"

import React from 'react';
import { AppBar } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { useRouter, usePathname } from 'next/navigation';
import { createDefaultUserInfo, createUserInfo } from '../model/UserInfo';

const getWelcomeName = (fname:string | undefined = undefined, lname:string | undefined = undefined):string => {
  var result:string = "Member Not Logged In";

  if (fname != undefined || lname != undefined) {
    if (fname != undefined && lname != undefined) {
      result = fname + " " + lname;
    }
    else if (fname != undefined) {
      result = fname;
    }
    else if (lname != undefined) {
      result = lname;
    }
  }

  return result;
}

const getBtnString = (isAuth:boolean = false) : string => {
  var result:string

  if (isAuth) {
    result = 'signout';
  }
  else {
    result = 'Login';
  }

  return result;
}

export const Nav = () => {
  let [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  let [wecomeName, setWelcomeName] = useState<string>(getWelcomeName);
  let [btnString, setBtnString] = useState<string>(getBtnString);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUInfo = async() => {
      try {
        let aInfo = await fetchUserAttributes();
        setIsAuthenticated(true);
        setWelcomeName(getWelcomeName(aInfo.given_name, aInfo.family_name));
        setBtnString(getBtnString(true));
      }
      catch(e) {
        setIsAuthenticated(false);
        setWelcomeName(getWelcomeName(undefined, undefined));
        setBtnString(getBtnString(false));
      }
    }

    getUInfo();
  }, []);

  const btnClick = async () => {
    if (isAuthenticated) {
      await signOut();
      setIsAuthenticated(false);
      setWelcomeName(getWelcomeName());
      setBtnString(getBtnString(false));

    }
    else {
      router.replace('/login');
    }
  }

  // TODO JLS, need to update auth after sign in
  // So use Hub (like in loging page)

  // Skip for /login
  if (pathname === '/login') {
    return <></>
  }

  return (<div>
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {wecomeName}
            </Typography>            
            <Button color="inherit" onClick={btnClick}>{btnString}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  </div>);
  }