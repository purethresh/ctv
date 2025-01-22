
export const cleanPhoneNumber = (phoneNumber:string) : string => {
    const result = phoneNumber.replace(/\D/g, "");

    return result;
}

export const formatPhoneNumber = (phoneNumber:string) : string => {
    const result = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    return result;
}