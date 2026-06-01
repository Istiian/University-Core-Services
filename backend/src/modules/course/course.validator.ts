import zod from 'zod';

export const createCourseSchema = zod.object({
    name: zod.string().min(1, 'Course name is required'),
    departmentId: zod.number().int().positive('Department ID must be a positive integer'),
});

export const updateCourseSchema = zod.object({
    name: zod.string().min(1, 'Course name is required').optional(),
});
