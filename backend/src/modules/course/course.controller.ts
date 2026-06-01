import { Request, Response, NextFunction } from 'express';
import { createCourse, getCourse, updateCourse, deleteCourse } from './course.service';
import { AppError } from '../../middleware/app-error';

export const createCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseData = req.body;
        const newCourse = await createCourse(courseData);
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: newCourse
        });
    } catch (error) {
        next(new AppError('Failed to create course', 500));
    }
};

export const getCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filter: any = {}
        if (req.query.courseId) filter.courseId = parseInt(req.query.courseId as string);
        if (req.query.name) filter.name = req.query.name as string;
        if (req.query.departmentId) filter.departmentId = parseInt(req.query.departmentId as string);
        const course = await getCourse(filter);
        res.status(200).json({
            message: 'Course retrieved successfully',
            success: true,
            course
        });
    } catch (error) {
        next(new AppError('Failed to retrieve course', 500));
    }
}

export const updateCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseIdParam = Array.isArray(req.params.courseId) ? req.params.courseId[0] : req.params.courseId;
        if (!courseIdParam) {
            return next(new AppError('Missing courseId parameter', 400));
        }

        const courseId = parseInt(courseIdParam, 10);
        if (Number.isNaN(courseId)) {
            return next(new AppError('Invalid courseId', 400));
        }

        const courseData = req.body;
        const updatedCourse = await updateCourse(courseId, courseData);
        if (!updatedCourse) {
            return next(new AppError('Course not found', 404));
        }
        res.status(200).json({
            message: 'Course updated successfully',
            success: true,
            course: updatedCourse
        });
    } catch (error) {
        next(new AppError('Failed to update course', 500));
    }
}

export const deleteCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseIdParam = Array.isArray(req.params.courseId) ? req.params.courseId[0] : req.params.courseId;
        if (!courseIdParam) {
            return next(new AppError('Missing courseId parameter', 400));
        }
        const courseId = parseInt(courseIdParam, 10);
        if (Number.isNaN(courseId)) {
            return next(new AppError('Invalid courseId', 400));

        }
        const deletedCourse = await deleteCourse(courseId);
        if (!deletedCourse) {
            return next(new AppError('Course not found', 404));
        }
        res.status(200).json({
            message: 'Course deleted successfully',
            success: true,
            course: deletedCourse
        });
    } catch (error) {
        next(new AppError('Failed to delete course', 500));
    }
}
