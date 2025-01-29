import { MinMemberInfo } from "../lib/MinMemberInfo";
import { MemberPhoneInfo } from "../lib/MemberPhoneInfo";
import { MemberEmailInfo } from "../lib/MemberEmailInfo";
import { MemberAddressInfo } from "../lib/MemberAddressInfo";

export interface SMemberInfoProp {
    isAdmin?: boolean;
    isEditing?: boolean;
    memberInfo?: MinMemberInfo;
    phoneList?: MemberPhoneInfo[];
    addressList?: MemberAddressInfo[];
    emailList?: MemberEmailInfo[];

    onCancel?: () => void;
    onRemoveLink?: (member_id:string) => void;

    onUpdatePhoneList?: (phoneList:MemberPhoneInfo[]) => void;
    onUpdateEmailList?: (emailList:MemberEmailInfo[]) => void;
    onUpdateAddressList?: (addressList:MemberAddressInfo[]) => void;

    saveMemberInfo?: (memberInfo:MinMemberInfo, phoneList:MemberPhoneInfo[], addressList:MemberAddressInfo[], emailList:MemberEmailInfo[]) => void;
}