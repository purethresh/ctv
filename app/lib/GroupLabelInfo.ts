import LabelInfo from './LabelInfo';
// This is a group that holds child labels


// It is also a label
export default class GroupLabelInfo extends LabelInfo {
    // Array of child labels
    childLabels:Array<LabelInfo>;

    constructor(info:object = {}) {
        super(info);
        this.isGroup = true;
        this.childLabels = [];
    }

    addChildLabel(label:LabelInfo) {
        this.childLabels.push(label);
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
        
        // Also sort scheduled
        this.sortScheduled();
    }
}