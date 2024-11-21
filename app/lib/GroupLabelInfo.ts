import LabelInfo from './LabelInfo';
// This is a group that holds child labels


// It is also a label
export default class GroupLabelInfo extends LabelInfo {
    // Array of child labels
    childLabels:Array<LabelInfo>;

    constructor(label_id:string | undefined = undefined, labelName:string | undefined = undefined, labelDescription:string | undefined = undefined, forSchedule:string | undefined = undefined ) {
        super(label_id, labelName, labelDescription, forSchedule);
        this.isGroup = true;
        this.childLabels = [];
    }

    addChildLabel(label:LabelInfo) {
        this.childLabels.push(label);
    }
}