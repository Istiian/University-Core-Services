import {createTransport} from 'nodemailer';
import { AppError } from '../middleware/app-error';
import { sendEmailRequest } from './auth/type.auth';

const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (emailData: sendEmailRequest) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
        });
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        throw new AppError('Failed to send email', 500);
    }
};