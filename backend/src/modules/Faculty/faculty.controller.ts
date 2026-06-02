import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../middleware/app-error';
import { generateCredentialSlip } from '../common.utils';
import { Person } from '../common.type';
import { createFaculty, deleteFaculty, getFaculty, updateFaculty } from './faculty.service';
import { FacultyInfo } from './faculty.type';

export const createFacultyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { facultyData, personalData }: { facultyData: FacultyInfo, personalData: Person } = req.body;
        const newFaculty = await createFaculty({ facultyData, personalData });
        const credentialSlip = generateCredentialSlip(newFaculty.username, newFaculty.password);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="account-slip.pdf"');
        credentialSlip.pipe(res);
        credentialSlip.end();
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to create faculty', 500));
    }
};

export const getFacultyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;

        const filter: any = {};
        if (req.query.facultyId) filter.facultyId = parseInt(req.query.facultyId as string);
        if (req.query.personId) filter.personId = parseInt(req.query.personId as string);
        if (req.query.departmentId) filter.departmentId = parseInt(req.query.departmentId as string);
        if (req.query.startDate) filter.startDate = req.query.startDate as string;
        if (req.query.status) filter.status = req.query.status as string;
        if (req.query.type) filter.type = req.query.type as string;
        if (req.query.search) filter.search = req.query.search as string;

        const facultyList = await getFaculty(page, limit, filter);

        res.status(200).json({
            message: 'Faculty retrieved successfully',
            success: true,
            faculty: facultyList,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to retrieve faculty', 500));
    }
};

export const updateFacultyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const facultyIdParam = Array.isArray(req.params.facultyId) ? req.params.facultyId[0] : req.params.facultyId;
        if (!facultyIdParam) {
            return next(new AppError('Missing facultyId parameter', 400));
        }

        const facultyId = parseInt(facultyIdParam, 10);
        if (Number.isNaN(facultyId)) {
            return next(new AppError('Invalid facultyId', 400));
        }

        const { facultyData, personalData }: { facultyData: FacultyInfo, personalData: Person } = req.body;
        const updatedFaculty = await updateFaculty(facultyId, { facultyData, personalData });

        res.status(200).json({
            success: true,
            message: 'Faculty updated successfully',
            faculty: updatedFaculty,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to update faculty', 500));
    }
};

export const deleteFacultyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const facultyIdParam = Array.isArray(req.params.facultyId) ? req.params.facultyId[0] : req.params.facultyId;
        if (!facultyIdParam) {
            return next(new AppError('Missing facultyId parameter', 400));
        }

        const facultyId = parseInt(facultyIdParam, 10);
        if (Number.isNaN(facultyId)) {
            return next(new AppError('Invalid facultyId', 400));
        }

        const deletedFaculty = await deleteFaculty(facultyId);
        if (!deletedFaculty) {
            return next(new AppError('Faculty not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Faculty deleted successfully',
            faculty: deletedFaculty,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to delete faculty', 500));
    }
};
