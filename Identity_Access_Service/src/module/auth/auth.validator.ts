import zod from 'zod';

const passwordSchema = zod
    .string()
    .min(9, "Password must be exactly 9 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const loginSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
});

export const requestPasswordResetSchema = zod.object({
    username: zod.string(),
});

export const resetPasswordSchema = zod.object({
    username: zod.string(),
    otp: zod.string().length(6),
    newPassword: passwordSchema,
    repeatNewPassword: passwordSchema,
}).refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "Passwords do not match",
    path: ["repeatNewPassword"],
});

export const verifyOTPSchema = zod.object({
    username: zod.string(),
    otp: zod.string().length(6),
});

export const changePasswordSchema = zod.object({
    currentPassword: zod.string(),
    newPassword: passwordSchema,
    repeatNewPassword: passwordSchema,
}).refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "Passwords do not match",
    path: ["repeatNewPassword"],
});

