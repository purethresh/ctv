export interface SMemberInfoProp {
    isAdmin?: boolean;
    memberId?: string;
    userId?: string;
    isEditing?: boolean;
    isCreating?: boolean;
    needsSave?: boolean;
    churchId?: string;
    updateNumber?: number;
    onSaveComplete?: () => void;
    onMemberCreated?: () => void;
}