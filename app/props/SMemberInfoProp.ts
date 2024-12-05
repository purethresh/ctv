export interface SMemberInfoProp {
    isAdmin?: boolean;
    memberId?: string;
    isEditing?: boolean;
    isCreating?: boolean;
    needsSave?: boolean;
    onSaveComplete?: () => void;
}