import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { AppBar, Menu, MenuItem, Link } from "@mui/material";
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
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [memberAnchor, setMemberAnchor] = useState<null | HTMLElement>(null);
  const [isLinkedMember, setIsLinkedMember] = useState<boolean>(false);

  const router = useRouter();

  const txtColor = 'primary.contrastText';

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

  const onMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  }

  const onMenuClose = () => {
    setMenuAnchor(null);
  }

  const onMemberOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMemberAnchor(event.currentTarget);
  }

  const onMemberClose = () => {
    setMemberAnchor(null);
  }
  
  useEffect(() => {
    const updatedInfo = props.userInfo || new UserInfo();
    setUserInfo(updatedInfo);
    const lm = updatedInfo.isLinkedMember();
    setIsLinkedMember(lm);

    const isAuth:boolean = updatedInfo.sub.length > 0;
    setIsAuthenticated(isAuth);
    setUserInitials(updatedInfo.getInitials());
    setChurchName(updatedInfo.churchName);
  }, [props.userInfo]);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            style={{display:isAuthenticated ? 'block' : 'none'}}
            onClick={onMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="app-menu"
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
            transformOrigin={{vertical: 'top', horizontal: 'left'}}
            onClose={onMenuClose}
            onClick={onMenuClose}            
            keepMounted
            >
            <MenuItem>
              <Link href="/" underline="none" color={txtColor}>Calandar</Link>
            </MenuItem>                
            <MenuItem>
              <Link href="/schedule/labels" underline="none" color={txtColor}>Labels</Link>
            </MenuItem>
            <MenuItem>
              <Link href="/schedule/member" underline="none" color={txtColor}>Members</Link>
            </MenuItem>
            <MenuItem>
              <Link href="/schedule/availability" underline="none" color={txtColor}>Availability</Link>
            </MenuItem>
            <MenuItem>
              <Link href="/schedule" underline="none" color={txtColor}>Scheduling</Link>
            </MenuItem>            
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {churchName}
          </Typography>
          <Button color="inherit" style={{display:isAuthenticated ? 'none' : 'block'}} onClick={gotoLogin}>Login</Button>
          <IconButton
            color="inherit"
            aria-label="avatar"
            sx={{ mr: 2 }}
            style={{display:isAuthenticated ? 'block' : 'none'}}
            onClick={onMemberOpen}
          >
            <Avatar>{userInitials}</Avatar>
          </IconButton>
          <Menu
            id="member-menu"
            open={Boolean(memberAnchor)}
            anchorEl={memberAnchor}
            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
            transformOrigin={{vertical: 'top', horizontal: 'left'}}
            onClose={onMemberClose}
            onClick={onMemberClose}            
            keepMounted
            >
            <MenuItem style={{display:isLinkedMember ? 'none' : 'block'}}>
              <Link href="/guest/link" underline="none" color={txtColor}>Link Member</Link>
            </MenuItem>                
            <MenuItem>
              <Link href="#" onClick={signOutFromApp} underline="none" color={txtColor}>Signout</Link>
            </MenuItem>          
          </Menu>          
        </Toolbar>
      </AppBar>
    </Box>
  );
}