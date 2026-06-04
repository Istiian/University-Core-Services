import {db} from '../db/client';
import {persons} from '../db/Person';
import {eq} from 'drizzle-orm';
import bcrypt from 'bcrypt';
import {createTransport} from 'nodemailer';
import { AppError } from '../middleware/app-error';
import { sendEmailRequest} from './auth/type.auth';
import PDFDocument from 'pdfkit';
import logger from '../../logger';
import { handleServiceError } from '../utils/serviceError';

const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const checkUserExists = async (email: string): Promise<boolean> => {
    const existingUser = await db.select().from(persons).where(eq(persons.email, email));
    logger.debug('Email uniqueness check', { email, exists: existingUser.length > 0 });
    return existingUser.length > 0;
}

export const checkRepeatPassword = (password: string, confirmPassword: string): boolean => {
    return password !== confirmPassword;
}

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};


export const sendEmail = async (emailData: sendEmailRequest) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
        });
        logger.info('Email sent', { to: emailData.to, subject: emailData.subject });
    } catch (error) {
        handleServiceError(error, 'sendEmail', 'Failed to send email');
    }
};

export const generateCredentialSlip = ( username: string, password: string) => {
    const doc = new PDFDocument();
    doc.fontSize(18).text('Credential Slip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Username: ${username}`);
    doc.text(`Password: ${password}`);
    doc.moveDown();
    doc.fontSize(12).text('Please change your password immediately.', { align: 'center' });
    doc.text('This is a system-generated document. Do not share your credentials with anyone.', { align: 'center' });
    doc.text('For questions, please contact the administrator.', { align: 'center' });
    return doc;
}

export const veritfyParam = (param: string, paramName: string): number => {
    const paramValue = parseInt(param, 10);
    if (Number.isNaN(paramValue)) {
        throw new AppError(`Invalid ${paramName}`, 400);
    }
    return paramValue;
}
