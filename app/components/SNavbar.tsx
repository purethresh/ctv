import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import Avatar from "@mui/material/Avatar";

export default function SNavbar() {
  let [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  let [churchName, setChurchName] = useState<string>('');
  let [userInitials, setUserInitials] = useState<string>('');

  const router = useRouter();

  const gotoLogin = async () => {
    router.push('/guest/login');
  };

  const getMemberInfo = async(subId:string) => {  
    if (subId && subId.length > 0) {
      const res = await fetch('/api/member?sub=' + subId);
      const data = await res.json();
      if (data) {
        setUserInitials(data.first[0] + data.last[0]);
        await getChurchInfo(data.member_id);
      }
    }
  }

  const getChurchInfo = async(memberId:string) => {
    if (memberId && memberId.length > 0) {
      const res = await fetch('/api/church?member_id=' + memberId);
      const data = await res.json();
      if (data) {
        setChurchName(data.churchName);
      }
    }
  }

  const getUserAttributes = async() => {
      try {
        let aInfo = await fetchUserAttributes();
        if (aInfo && aInfo.sub) {
          // Get Member info (but don't wait for it)
          getMemberInfo(aInfo.sub);
        }

        // Set it as authenticated to change the UI
        setIsAuthenticated(true);
      }
      catch(e) {
        setIsAuthenticated(false);
      }
  }

  const signOutFromApp = async() => {
    setIsAuthenticated(false);
    setChurchName('');
    setUserInitials('');
    await signOut();
  }

  useEffect(() => {
    const getUInfo = async() => {
      await getUserAttributes();
    }

    getUInfo();
  }, []);
  
  
  return (
    <div>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            style={{display:isAuthenticated ? 'block' : 'none'}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {churchName}
          </Typography>
          <Button color="inherit" style={{display:isAuthenticated ? 'none' : 'block'}} onClick={gotoLogin}>Login</Button>
          <IconButton
            color="inherit"
            aria-label="avatar"
            sx={{ mr: 2 }}
            style={{display:isAuthenticated ? 'block' : 'none'}}
            onClick={signOutFromApp}
          >
            <Avatar>{userInitials}</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
    </div>
  );
}