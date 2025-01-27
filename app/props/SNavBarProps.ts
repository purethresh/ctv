import UserInfo from "../lib/UserInfo";

export interface SNavBarProps {
    userInfo?: UserInfo;
    onSignout?: () => void;
}