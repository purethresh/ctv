interface UserInfo {
    isAuthenticated:boolean;
    firstName:string;
    lastName:string;    
}

export function createUserInfo(isAuth:boolean, fname:string | undefined, lname:string | undefined) : UserInfo {
    var result:UserInfo = {isAuthenticated:isAuth, firstName:'', lastName:''} as UserInfo;

    if (fname != null) {
        result.firstName = fname;
    }
    if (lname != null) {
        result.lastName = lname;
    }

    return result;
}

export function createDefaultUserInfo() : UserInfo {
    return createUserInfo(false, '', '');
}