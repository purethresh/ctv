import { MinMemberInfo } from "../lib/MinMemberInfo";

export interface SMemberInfoProp {
    isAdmin?: boolean;
    isEditing?: boolean;
    isCreating?: boolean;
    needsSave?: boolean;
    updateNumber?: number;
    memberInfo: MinMemberInfo;
    onSaveComplete?: () => void;
    onMemberCreated?: () => void;
}