export type loginRequest = {
    email: string;
    password: string;
}

export type otpRequest = {
    email: string;
}

export type resetPasswordRequest = {
    email: string;
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
    role: 'student' | 'faculty' | 'admin' | 'dean' | 'programChair' | 'staff';
    office?: string;
    department?: string;
    course?: string;
}
    

export type AuthUser = {
    personId: number;
    role: 'student' | 'faculty' | 'admin' | 'dean' | 'programChair' | 'staff';
    password: string;
    student?: {
        course?: {
            name: string;
        } | null;
    } | null;
    faculty?: {
        department?: {
            name: string;
        } | null;
    } | null;
    admin?: {
        office?: {
            name: string;
        } | null;
    } | null;
    dean?: {
        department?: {
            name: string;
        } | null;
    } | null;
    programChair?: {
        course?: {
            name: string;
        } | null;
    } | null;
    staff?: {
        office?: {
            name: string;
        } | null;
    } | null;
}


