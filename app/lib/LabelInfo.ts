
// This is a label.
// It could have multiple people assigned to it

export default class LabelInfo {
    label_id:string;
    labelName:string;
    labelDescription:string;
    forSchedule:boolean;
    isGroup:boolean;

    constructor(label_id:string | undefined = undefined, labelName:string | undefined = undefined, labelDescription:string | undefined = undefined, forSchedule:string | undefined = undefined ) {
        this.label_id = label_id ? label_id : '';
        this.labelName = labelName ? labelName : '';
        this.labelDescription = labelDescription ? labelDescription : '';
        if (forSchedule == undefined) {
            this.forSchedule = false;
        }
        else {
            this.forSchedule = forSchedule == 'true' ? true : false;
        }
        this.isGroup = false;
    }

}