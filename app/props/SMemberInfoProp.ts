export interface SMemberInfoProp {
    isAdmin?: boolean;
    memberId?: string;
    userId?: string;
    isEditing?: boolean;
    isCreating?: boolean;
    needsSave?: boolean;
    churchId?: string;
    onSaveComplete?: () => void;
    onMemberCreated?: () => void;
}