import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../middleware/app-error';
import { generateCredentialSlip } from '../common.utils';
import { Person } from '../common.type';
import { createDean, deleteDean, listDeans,getDeanById, updateDean } from './dean.service';
import { DeanInfo } from './dean.type';
import { veritfyParam } from '../common.utils';

export const createDeanHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { deanData, personalData }: { deanData: DeanInfo, personalData: Person } = req.body;
        const newDean = await createDean({ deanData, personalData });
        const credentialSlip = generateCredentialSlip(newDean.username, newDean.password);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="account-slip.pdf"');
        credentialSlip.pipe(res);
        credentialSlip.end();
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to create dean', 500));
    }
};

export const listDeansHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;

        const filter: any = {};
        if (req.query.departmentId) filter.departmentId = parseInt(req.query.departmentId as string);
        if (req.query.startDate) filter.startDate = req.query.startDate as string;
        if (req.query.status) filter.status = req.query.status as string;
        if (req.query.type) filter.type = req.query.type as string;
        if (req.query.search) filter.search = req.query.search as string;

        const deanList = await listDeans(page, limit, filter);

        res.status(200).json({
            message: 'Dean retrieved successfully',
            success: true,
            dean: deanList,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to retrieve dean', 500));
    }
};

export const getDeanByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deanIdParam = Array.isArray(req.params.deanId) ? req.params.deanId[0] : req.params.deanId;
        if (!deanIdParam) {
            return next(new AppError('Missing deanId parameter', 400));
        }
        const deanId = veritfyParam(deanIdParam, 'deanId');
        const dean = await getDeanById(deanId);
        if (!dean) {
            return next(new AppError('Dean not found', 404));
        }
        res.status(200).json({
            message: 'Dean retrieved successfully',
            success: true,
            dean,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to retrieve dean', 500));
    }
};

export const updateDeanHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deanIdParam = Array.isArray(req.params.deanId) ? req.params.deanId[0] : req.params.deanId;
        if (!deanIdParam) {
            return next(new AppError('Missing deanId parameter', 400));
        }

        const deanId = veritfyParam(deanIdParam, 'deanId');
        const { deanData, personalData }: { deanData: DeanInfo, personalData: Person } = req.body;
        const updatedDean = await updateDean(deanId, { deanData, personalData });

        res.status(200).json({
            success: true,
            message: 'Dean updated successfully',
            dean: updatedDean,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to update dean', 500));
    }
};

export const deleteDeanHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deanIdParam = Array.isArray(req.params.deanId) ? req.params.deanId[0] : req.params.deanId;
        if (!deanIdParam) {
            return next(new AppError('Missing deanId parameter', 400));
        }

        const deanId = veritfyParam(deanIdParam, 'deanId');
        const deletedDean = await deleteDean(deanId);
        if (!deletedDean) {
            return next(new AppError('Dean not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Dean deleted successfully',
            dean: deletedDean,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to delete dean', 500));
    }
};