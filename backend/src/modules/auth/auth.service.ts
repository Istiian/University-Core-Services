import bcrypt from 'bcrypt';
import { persons } from "../../db/Person";
import { verifyPassword, hashPassword, generateOTP, generateAccessToken, generateRefreshToken, formatTokenCredentials, verifyRefreshToken, verifyOTP } from "./auth.utils";
import { AppError } from "../../middleware/app-error";
import { loginRequest, otpRequest, resetPasswordRequest } from "./type.auth";
import { db } from "../../db/client";
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { redisClient } from "../../../redis";
import { sendEmail } from '../nodemailer';

export const login = async (loginData: loginRequest) => {
    try {

        const user = await db.query.persons.findFirst({
            where: eq(persons.email, loginData.email),
            columns: { personId: true, role: true, password: true },
            with: {
                student: {
                    columns: {}, with: {
                        course: {
                            columns: {
                                name: true,
                            }
                        }
                    }
                },
                faculty: {
                    columns: {}, with: {
                        department: {
                            columns: {
                                name: true,
                            }
                        }
                    }
                },
                admin: {
                    columns: {}, with: {
                        office: {
                            columns: {
                                name: true,
                            }
                        }
                    }
                },
                dean: {
                    columns: {}, with: {
                        department: {
                            columns: {
                                name: true,
                            }
                        }
                    }
                },
                programChair: {
                    columns: {}, with: {
                        course: {
                            columns: {
                                name: true,
                            }
                        }
                    }
                },
                staff: {
                    columns: {}, with: {
                        office: {
                            columns: {
                                name: true,
                            }
                        }
                    }
                },
            },
        });
        
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const isMatch = await verifyPassword(loginData.password, user.password);
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        //format token credentials
        const tokenCredentials = formatTokenCredentials(user);

        const accessToken = generateAccessToken(tokenCredentials);
        const refreshToken = generateRefreshToken(tokenCredentials);
        console.log('Generated tokens for personId:', user.personId);
        
        // Store refresh token in Redis with an expiration time (e.g., 7 days)
        await redisClient.setEx(`refreshToken:${user.personId}`, 7 * 24 * 60 * 60, refreshToken)
        
        return { accessToken, refreshToken };
            
    } catch (error) {
        if (error instanceof Error) {
            throw new AppError(`Login failed: ${error.message}`, 500);
        }
    }
}

export const deleteRefreshTokens = async (personId: number) => {
    try {
        await redisClient.del(`refreshToken:${personId}`);
       
    } catch (error) {
        throw new AppError('Failed to delete refresh tokens', 500);
    }
}

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const tokenCredentials = verifyRefreshToken(refreshToken);
        const storedRefreshToken = await redisClient.get(`refreshToken:${tokenCredentials.personId}`);
        
        if (!storedRefreshToken) {
            throw new AppError('Refresh token not found', 401);
        }

        if (storedRefreshToken !== refreshToken) {
            throw new AppError('Invalid refresh token', 401);
        }

        // Generate new access token
        const accessToken = generateAccessToken(tokenCredentials);
        return { accessToken };

    } catch (error) {
        if (error instanceof Error) {
            throw new AppError(`Failed to refresh access token: ${error.message}`, 500);
        }
    }
}

export const sendOTP = async (otpData: otpRequest) => {
    try{
        const email = otpData.email;
        const user = await db.query.persons.findFirst({
            where: eq(persons.email, email),
            columns: { personId: true },
        });
        
        const checkExistingOTP = await redisClient.get(`otp:${user?.personId}`);

        if (checkExistingOTP) {
            throw new AppError('An OTP has already been sent. Please check your email.', 429);
        }

        if (!user) {
            throw new AppError('User not found', 404);
        }
        const otp = generateOTP();
        const sendOtpEmail = await sendEmail(
            {
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP code is: ${otp}`
            }
        );
        // Implement OTP sending logic here (e.g., via email or SMS)
        await redisClient.setEx(`otp:${user.personId}`, 5 * 60, otp); // Store OTP in Redis with a 5-minute expiration

        return otp
    }catch (error) {
        if (error instanceof Error) {
            throw new AppError(`Failed to send OTP: ${error.message}`, 500);
        }
    }
}

export const resetPassword = async (resetData: resetPasswordRequest) => {
    try {
        const { email, otp, newPassword } = resetData;
       
        const user = await db.query.persons.findFirst({
            where: eq(persons.email, email),
            columns: { personId: true },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const isOTPValid = await verifyOTP(user.personId, otp);

        if (!isOTPValid) {
            throw new AppError('Invalid OTP', 401);
        }
        const hashedPassword = await hashPassword(newPassword);
        await db.update(persons).set({ password: hashedPassword }).where(eq(persons.personId, user.personId));
        return { success: true, message: 'Password reset successful' };
    } catch (error) {
        if (error instanceof Error) {
            throw new AppError(`Failed to reset password: ${error.message}`, 500);
        }
    }
}
