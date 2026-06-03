import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../middleware/app-error';
import { generateCredentialSlip, veritfyParam } from '../common.utils';
import { Person } from '../common.type';
import { createAdmin, deleteAdmin, listAdmins, getAdminById, updateAdmin } from './admin.service';
import { AdminInfo } from './admin.type';

export const createAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { adminData, personalData }: { adminData: AdminInfo, personalData: Person } = req.body;
        const newAdmin = await createAdmin({ adminData, personalData });
        const credentialSlip = generateCredentialSlip(newAdmin.username, newAdmin.password);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="account-slip.pdf"');
        credentialSlip.pipe(res);
        credentialSlip.end();
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to create admin', 500));
    }
};

export const listAdminsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;

        const filter: any = {};
        if (req.query.officeId) filter.officeId = parseInt(req.query.officeId as string);
        if (req.query.startDate) filter.startDate = req.query.startDate as string;
        if (req.query.status) filter.status = req.query.status as string;
        if (req.query.type) filter.type = req.query.type as string;
        if (req.query.search) filter.search = req.query.search as string;

        const adminList = await listAdmins(page, limit, filter);

        res.status(200).json({
            message: 'Admins retrieved successfully',
            success: true,
            admin: adminList,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to retrieve admin', 500));
    }
};

export const getAdminByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminIdParam = Array.isArray(req.params.adminId) ? req.params.adminId[0] : req.params.adminId;
        if (!adminIdParam) {
            return next(new AppError('Missing adminId parameter', 400));
        }
        const adminId = veritfyParam(adminIdParam, 'adminId');
        const admin = await getAdminById(adminId);
        if (!admin) {
            return next(new AppError('Admin not found', 404));
        }
        res.status(200).json({
            message: 'Admin retrieved successfully',
            success: true,
            admin,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to retrieve admin', 500));
    }
};

export const updateAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminIdParam = Array.isArray(req.params.adminId) ? req.params.adminId[0] : req.params.adminId;
        if (!adminIdParam) {
            return next(new AppError('Missing adminId parameter', 400));
        }

        const adminId = veritfyParam(adminIdParam, 'adminId');
        const { adminData, personalData }: { adminData: AdminInfo, personalData: Person } = req.body;
        const updatedAdmin = await updateAdmin(adminId, { adminData, personalData });

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            admin: updatedAdmin,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to update admin', 500));
    }
};

export const deleteAdminHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminIdParam = Array.isArray(req.params.adminId) ? req.params.adminId[0] : req.params.adminId;
        if (!adminIdParam) {
            return next(new AppError('Missing adminId parameter', 400));
        }

        const adminId = veritfyParam(adminIdParam, 'adminId');
        const deletedAdmin = await deleteAdmin(adminId);
        if (!deletedAdmin) {
            return next(new AppError('Admin not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
            admin: deletedAdmin,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to delete admin', 500));
    }
};