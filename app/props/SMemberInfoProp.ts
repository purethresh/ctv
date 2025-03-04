import { MemberPhoneInfo } from "../lib/MemberPhoneInfo";
import { MemberEmailInfo } from "../lib/MemberEmailInfo";
import { MemberAddressInfo } from "../lib/MemberAddressInfo";
import { FullMemberInfo } from "../lib/FullMemberInfo";

export interface SMemberInfoProp {
    isAdmin?: boolean;
    isEditing?: boolean;
    memberInfo: FullMemberInfo;
    phoneList?: MemberPhoneInfo[];
    addressList?: MemberAddressInfo[];
    emailList?: MemberEmailInfo[];

    onCancel?: () => void;
    onRemoveLink?: (member_id:string) => void;

    onUpdatePhoneList?: (phoneList:MemberPhoneInfo[]) => void;
    onUpdateEmailList?: (emailList:MemberEmailInfo[]) => void;
    onUpdateAddressList?: (addressList:MemberAddressInfo[]) => void;

    saveMemberInfo?: (memberInfo:FullMemberInfo, phoneList:MemberPhoneInfo[], addressList:MemberAddressInfo[], emailList:MemberEmailInfo[]) => void;
}