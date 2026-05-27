import { NextFunction, Request, Response } from 'express';
import { recordPersonalInfo, 
    recordStudentInfo, 
    recordStaffInfo, 
    recordAdminInfo,
    recordFacultyInfo,
    recordDeanInfo,
    recordProgramChairInfo
 } from './person.service';
import logger from '../../../logger'
import { db } from "../../../index";
import { students } from '../../db/Student';

type UserType = 'student' | 'staff' | 'faculty' | 'admin' | 'program_chair' | 'dean';


export const registerStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, studentData } = req.body;

        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.id;
            const student = await recordStudentInfo({ ...studentData, personId }, trx);
            return { person, student };
        });

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        logger.error('Error registering student:', error);
        next(error);
    }
}

export const registerStaffHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, staffData } = req.body;
        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.id;
            const staffMember = await recordStaffInfo({ ...staffData, personId }, trx);
            return { person, staffMember };
        });

        res.status(201).json({
            success: true,
            message: 'Staff member registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        logger.error('Error registering staff member:', error);
        next(error);
    }
}

export const registerAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, adminData } = req.body;
        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.id;
            const admin = await recordAdminInfo({ ...adminData, personId }, trx);
            return { person, admin };
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        logger.error('Error registering admin:', error);
        next(error);
    }
}

export const registerFacultyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, facultyData } = req.body;

        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.id;
            const facultyMember = await recordFacultyInfo({ ...facultyData, personId }, trx);
            return { person, facultyMember };
        });

        res.status(201).json({
            success: true,
            message: 'Faculty member registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        logger.error('Error registering faculty member:', error);
        next(error);
    }
}

export const registerDeanHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, deanData } = req.body;
        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.id;
            const dean = await recordDeanInfo({ ...deanData, personId }, trx);
            return { person, dean };
        });

        res.status(201).json({
            success: true,
            message: 'Dean registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        logger.error('Error registering dean:', error);
        next(error);
    }
}

export const registerProgramChairHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, programChairData } = req.body;
        const dbTransaction = await db.transaction(async (trx) => {
            const person = await recordPersonalInfo(personalData, trx);
            const personId = person.id;
            const programChair = await recordProgramChairInfo({ ...programChairData, personId }, trx);
            return { person, programChair };
        });
        res.status(201).json({
            success: true,
            message: 'Program chair registered successfully',
            data: dbTransaction
        });
    } catch (error) {
        logger.error('Error registering program chair:', error);
        next(error);
    }
}
    


// export const registerUser = async (req: Request, res: Response) => {
//     try {
//         const { personalData, roleData, personType } = req.body;
//         const validUserTypes: UserType[] = ['student', 'staff', 'faculty', 'admin', 'program_chair', 'dean'];

//         if (!personalData || !roleData || !personType) {
//             return res.status(400).json({ message: 'Missing required fields: personData, roleData, or personType' });
//         }

//         if (!validUserTypes.includes(personType)) {
//             return res.status(400).json({ message: 'Invalid user type' });
//         }

//         const dbTransaction = await db.transaction(async (trx) => {
//             const personId = await recordPersonalInfo(personalData, trx);

//             switch (personType) {
//                 case 'student': {
//                     let { enrollmentDate, courseId, status, section, studentType } = roleData;
//                     await recordStudentInfo({ ...roleData, personId }, trx);
//                     break;
//                 }
//                 case 'staff': {
//                     let { officeId, hireDate } = roleData;
//                     await recordStaffInfo({ ...roleData, personId }, trx);
//                     break;
//                 }

//             }
//         });

//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         logger.error('Error registering user:', error);

//         if (error instanceof Error && error.message.startsWith('Validation error:')) {
//             return res.status(400).json({ message: error.message.replace('Validation error: ', '') });
//         }

//         res.status(500).json({ message: 'Failed to register user' });
//     }
// }
