import zod from 'zod';

export const createDepartmentSchema = zod.object({
    name: zod.string().min(1, 'Department name is required'),
});

export const updateDepartmentSchema = zod.object({
    name: zod.string().min(1, 'Department name is required').optional(),
});
