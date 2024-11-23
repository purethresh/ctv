
// This is a label.
// It could have multiple people assigned to it

interface LabelInfoProps {
    label_id?:string;
    labelName?:string;
    labelDescription?:string;
    forSchedule?:string;
    owner_id?:string;
}

export default class LabelInfo {
    // Array of child labels
    childLabels:Array<LabelInfo>;

    label_id:string;
    labelName:string;
    labelDescription:string;
    forSchedule:boolean;
    isGroup:boolean;
    owner_id:string;

    isMemberOfLabel:boolean;
    isOwnerOfLabel:boolean;

    scheduled:any[];

    constructor(info:object = {}) {
        const lInfo = info as LabelInfoProps;

        this.label_id = lInfo.label_id || '';
        this.labelName = lInfo.labelName || '';
        this.labelDescription = lInfo.labelDescription || '';
        this.owner_id = lInfo.owner_id || '';

        if (lInfo.forSchedule == undefined) {
            this.forSchedule = false;
        }
        else {
            this.forSchedule = lInfo.forSchedule !== 'false';
        }

        this.isGroup = false;
        this.scheduled = [];
        this.childLabels = [];

        this.isMemberOfLabel = false;
        this.isOwnerOfLabel = false;
    }

    addChildLabel(label:LabelInfo) {
        this.childLabels.push(label);
        this.isGroup = true;
    }

    sortChildLabels() {        
        // Sort the child labels
        this.childLabels.sort((a:LabelInfo, b:LabelInfo) => {
            if (a.labelName < b.labelName) {
                return -1;
            }
            if (a.labelName > b.labelName) {
                return 1;
            }
            return 0;
        });        
    }


}