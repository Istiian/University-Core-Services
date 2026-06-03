import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../middleware/app-error';
import { createStaff, listStaff,getStaffById, updateStaff, deleteStaff } from './staff.service';
import { StaffInfo } from './staff.type';
import { Person } from '../common.type';
import { generateCredentialSlip } from '../common.utils';
import { veritfyParam } from '../common.utils';

export const createStaffHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { staffData, personalData }: { staffData: StaffInfo, personalData: Person } = req.body;
        const newStaff = await createStaff({ staffData, personalData });
        const credentialSlip = generateCredentialSlip(newStaff.username, newStaff.password);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="account-slip.pdf"');
        credentialSlip.pipe(res);
        credentialSlip.end();

    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to create staff', 500));
    }
};

export const listStaffHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;

        const filter: any = {};
        if (req.query.staffId) filter.staffId = parseInt(req.query.staffId as string);
        if (req.query.personId) filter.personId = parseInt(req.query.personId as string);
        if (req.query.officeId) filter.officeId = parseInt(req.query.officeId as string);
        if (req.query.startDate) filter.startDate = req.query.startDate as string;
        if (req.query.status) filter.status = req.query.status as string;
        if (req.query.type) filter.type = req.query.type as string;
        if (req.query.search) filter.search = req.query.search as string;
        
        const staffList = await listStaff(page, limit, filter);
        
        res.status(200).json({
            message: 'Staff retrieved successfully',
            success: true,
            staff: staffList
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to retrieve staff', 500));
    }
}

export const getStaffByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staffIdParam = Array.isArray(req.params.staffId) ? req.params.staffId[0] : req.params.staffId;
        if (!staffIdParam) {
            return next(new AppError('Missing staffId parameter', 400));
        }
        const staffId = veritfyParam(staffIdParam, 'staffId');
        const staff = await getStaffById(staffId);

        if (!staff) {
            return next(new AppError('Staff not found', 404));
        }
        res.status(200).json({
            message: 'Staff retrieved successfully',
            success: true,
            staff: staff
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to retrieve staff', 500));
    }
}
        

export const updateStaffHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staffIdParam = Array.isArray(req.params.staffId) ? req.params.staffId[0] : req.params.staffId;
        if (!staffIdParam) {
            return next(new AppError('Missing staffId parameter', 400));
        }

        const staffId = veritfyParam(staffIdParam, 'staffId');
        const { staffData, personalData }: { staffData: StaffInfo, personalData: Person } = req.body;
        const updatedStaff = await updateStaff(staffId, { staffData, personalData });
       
        res.status(200).json({
            success: true,
            message: 'Staff updated successfully',
            staff: updatedStaff
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to update staff', 500));
    }
}

export const deleteStaffHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const staffIdParam = Array.isArray(req.params.staffId) ? req.params.staffId[0] : req.params.staffId;
        if (!staffIdParam) {
            return next(new AppError('Missing staffId parameter', 400));
        }
        
        const staffId = veritfyParam(staffIdParam, 'staffId');
        
        const deletedStaff = await deleteStaff(staffId);
        if (!deletedStaff) {
            return next(new AppError('Staff not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Staff deleted successfully',
            staff: deletedStaff
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to delete staff', 500));
    }
}
