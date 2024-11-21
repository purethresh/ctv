import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { signOut } from "aws-amplify/auth";
import Avatar from "@mui/material/Avatar";
import UserInfo from "../lib/UserInfo";
import { SNavBarProps } from "../props/SNavBarProps";

export default function SNavbar(props: SNavBarProps) {
  let [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  let [churchName, setChurchName] = useState<string>('');
  let [userInitials, setUserInitials] = useState<string>('');
  let [userInfo, setUserInfo] = useState<UserInfo>(new UserInfo());

  const router = useRouter();

  const gotoLogin = async () => {
    router.push('/guest/login');
  };

  const signOutFromApp = async() => {
    setIsAuthenticated(false);
    setChurchName('');
    setUserInitials('');
    await signOut();
    if (props.onSignout) {
      props.onSignout();
    }
  }
  
  useEffect(() => {
    const updatedInfo = props.userInfo || new UserInfo();
    setUserInfo(updatedInfo);

    const isAuth:boolean = updatedInfo.sub.length > 0;
    setIsAuthenticated(isAuth);
    setUserInitials(updatedInfo.getInitials());
    setChurchName(updatedInfo.churchName);
  }, [props.userInfo]);
  
  
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