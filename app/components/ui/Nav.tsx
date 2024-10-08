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
import { Hub } from "aws-amplify/utils";

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

  const setAuthInfo = (aInfo:object | undefined) => {
    if (aInfo != undefined) {
      setIsAuthenticated(true);
      // @ts-ignore
      setWelcomeName(getWelcomeName(aInfo.given_name, aInfo.family_name));
      setBtnString(getBtnString(true));
    }
    else {
      setIsAuthenticated(false);
      setWelcomeName(getWelcomeName(undefined, undefined));
      setBtnString(getBtnString(false));
    }
  }

  const getUserInfo = async() => {
      try {
        let aInfo = await fetchUserAttributes();
        setAuthInfo(aInfo);
      }
      catch(e) {
        setAuthInfo(undefined);
      }
  }

  useEffect(() => {
    const getUInfo = async() => {
      await getUserInfo();
    }

    getUInfo();
  }, []);

  Hub.listen('auth', ({payload}) => {
      switch(payload.event) {
          case 'signedIn':
            // We just signed in but we are at login. So go home
            if (pathname === '/login') {
              router.replace('/');
            }
            if (!isAuthenticated) {
              getUserInfo();
            }
            break;
          case 'signedOut':
            break;
          default:
              // Don't do anything
      }
  });

  const btnClick = async () => {
    if (isAuthenticated) {
      await signOut();
      setAuthInfo(undefined); // Reset
      router.replace('/login');
    }
    else {
      router.replace('/login');
    }
  }

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