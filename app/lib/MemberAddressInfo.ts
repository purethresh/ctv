export interface IMemberAddressInfo {
    address_id?:string;
    member_id?:string;
    address1?:string;
    address2?:string;
    city?:string;
    state?:string;
    zip?:string;
};

export class MemberAddressInfo {
    address_id:string = '';
    member_id:string = '';
    address1:string = '';
    address2:string = '';
    city:string = '';
    state:string = '';
    zip:string = '';

    constructor(obj:IMemberAddressInfo = {}) {
        this.address_id = obj.address_id || '';
        this.member_id = obj.member_id || '';
        this.address1 = obj.address1 || '';
        this.address2 = obj.address2 || '';
        this.city = obj.city || '';
        this.state = obj.state || '';
        this.zip = obj.zip || '';    
    }
}