import { Request, Response, NextFunction } from 'express';
import { createDepartment, getDepartment, updateDepartment, deleteDepartment } from './department.service';
import { AppError } from '../../middleware/app-error';

export const createDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deptData = req.body;
        const newDept = await createDepartment(deptData);
        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            department: newDept
        });
    } catch (error) {
        next(new AppError('Failed to create department', 500));
    }
};

export const getDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filter: any = {}
        if (req.query.departmentId) filter.departmentId = parseInt(req.query.departmentId as string);
        if (req.query.name) filter.name = req.query.name as string;
        const departments = await getDepartment(filter);
        res.status(200).json({
            message: 'Department retrieved successfully',
            success: true,
            departments
        });
    } catch (error) {
        next(new AppError('Failed to retrieve department', 500));
    }
}

export const updateDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const departmentIdParam = Array.isArray(req.params.departmentId) ? req.params.departmentId[0] : req.params.departmentId;
        if (!departmentIdParam) {
            return next(new AppError('Missing departmentId parameter', 400));
        }

        const departmentId = parseInt(departmentIdParam, 10);
        if (Number.isNaN(departmentId)) {
            return next(new AppError('Invalid departmentId', 400));
        }

        const deptData = req.body;
        const updatedDept = await updateDepartment(departmentId, deptData);
        if (!updatedDept) {
            return next(new AppError('Department not found', 404));
        }
        res.status(200).json({
            message: 'Department updated successfully',
            success: true,
            department: updatedDept
        });
    } catch (error) {
        next(new AppError('Failed to update department', 500));
    }
}

export const deleteDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const departmentIdParam = Array.isArray(req.params.departmentId) ? req.params.departmentId[0] : req.params.departmentId;
        if (!departmentIdParam) {
            return next(new AppError('Missing departmentId parameter', 400));
        }
        const departmentId = parseInt(departmentIdParam, 10);
        if (Number.isNaN(departmentId)) {
            return next(new AppError('Invalid departmentId', 400));

        }
        const deletedDept = await deleteDepartment(departmentId);
        if (!deletedDept) {
            return next(new AppError('Department not found', 404));
        }
        res.status(200).json({
            message: 'Department deleted successfully',
            success: true,
            department: deletedDept
        });
    } catch (error) {
        next(new AppError('Failed to delete department', 500));
    }
}
