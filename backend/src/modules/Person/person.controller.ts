import { NextFunction, Request, Response } from 'express';
import { recordPersonalInfo, 
    recordStudentInfo, 
    recordStaffInfo, 
    recordAdminInfo,
    recordFacultyInfo,
    recordDeanInfo,
    recordProgramChairInfo
 } from './person.service';
import { db } from '../../db/client';

type UserType = 'student' | 'staff' | 'faculty' | 'admin' | 'program_chair' | 'dean';


export const registerStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, studentData } = req.body;

        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.personId;
            const student = await recordStudentInfo({ ...studentData, personId }, trx);
            return { person, student };
        });

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        next(error);
    }
}

export const registerStaffHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, staffData } = req.body;
        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.personId;
            const staffMember = await recordStaffInfo({ ...staffData, personId }, trx);
            return { person, staffMember };
        });

        res.status(201).json({
            success: true,
            message: 'Staff member registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        next(error);
    }
}

export const registerAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, adminData } = req.body;
        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.personId;
            const admin = await recordAdminInfo({ ...adminData, personId }, trx);
            return { person, admin };
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        next(error);
    }
}

export const registerFacultyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, facultyData } = req.body;

        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.personId;
            const facultyMember = await recordFacultyInfo({ ...facultyData, personId }, trx);
            return { person, facultyMember };
        });

        res.status(201).json({
            success: true,
            message: 'Faculty member registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        next(error);
    }
}

export const registerDeanHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, deanData } = req.body;
        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.personId;
            const dean = await recordDeanInfo({ ...deanData, personId }, trx);
            return { person, dean };
        });

        res.status(201).json({
            success: true,
            message: 'Dean registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        next(error);
    }
}

export const registerProgramChairHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, programChairData } = req.body;
        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.personId;
            const programChair = await recordProgramChairInfo({ ...programChairData, personId }, trx);
            return { person, programChair };
        });
        res.status(201).json({
            success: true,
            message: 'Program chair registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        next(error);
    }
}
    
