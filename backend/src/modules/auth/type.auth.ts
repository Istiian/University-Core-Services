export type loginRequest = {
    username: string;
    password: string;
}

export type otpRequest = {
    username: string;
}

export type resetPasswordRequest = {
    username: string;
    otp: string;
    newPassword: string;
    
}

export type sendEmailRequest = {
    to: string;
    subject: string;
    text: string;
}

export type tokenCredentials = {
    personId: number;
    role: number;
    office?: string;
    department?: string;
    course?: string;
    studentId?: number;
    adminId?: number;
    facultyId?: number;
    deanId?: number;
    programChairId?: number;
    staffId?: number;
}
    

export type AuthUser = {
    personId: number;
    role: number;
    password: string;
    student?: {
        studentId: number;
        course?: {
            name: string;
        } | null;
    } | null;
    faculty?: {
        facultyId: number;
        department?: {
            name: string;
        } | null;
    } | null;
    admin?: {
        adminId: number;
        office?: {
            name: string;
        } | null;
    } | null;
    dean?: {
        deanId: number;
        department?: {
            name: string;
        } | null;
    } | null;
    programChair?: {
        programChairId: number;
        course?: {
            name: string;
        } | null;
    } | null;
    staff?: {
        staffId: number;
        office?: {
            name: string;
        } | null;
    } | null;
}

export type changePasswordRequest = {
    personId: number;
    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;
}