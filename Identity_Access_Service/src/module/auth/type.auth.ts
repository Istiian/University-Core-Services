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
    repeatNewPassword: string;
    
}

export type sendEmailRequest = {
    to: string;
    subject: string;
    text: string;
}

export type changePasswordRequest = {
    personId: number;
    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;
}

export type tokenCredentials = {
    userId: number;
    role: "Student" | "Faculty" | "Staff" | "Admin" | "SuperAdmin";
}