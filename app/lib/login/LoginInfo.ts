import { LoginType } from "./LoginType";
const Cookies = require('js-cookie')

export class LoginInfo {
    loginType: LoginType;
    member_id: string;
    member_name: string;

    defaultExpireDays = 60;

    constructor() {
        this.loginType = LoginType.none;
        this.member_id = '';
        this.member_name = '';
    }

    loadFromCookie() {
        var c = Cookies.get("loginType");
        if (c) {
            // @ts-ignore
            this.loginType = LoginType[c];
        }
        else {
            this.loginType = LoginType.none;
        }

        this.member_id = Cookies.get("member_id") || '';
        this.member_name = Cookies.get("member_name") || '';
    }

    setCookie() {
        Cookies.set("loginType", this.loginType.toString(), {expires: this.defaultExpireDays});
        Cookies.set("member_id", this.member_id, {expires: this.defaultExpireDays});
        Cookies.set("member_name", this.member_name, {expires: this.defaultExpireDays});
    }
}