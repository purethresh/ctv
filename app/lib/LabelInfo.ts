
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
    label_id:string;
    labelName:string;
    labelDescription:string;
    forSchedule:boolean;
    isGroup:boolean;
    owner_id:string;

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
    }

    sortScheduled() {
        // TODO JLS
        // For now ignoring
        // I expect only 1 scheduled person per label
    }

}