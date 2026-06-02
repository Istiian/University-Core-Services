import z from 'zod';
import { personSchema, dateStringSchema } from '../common.validator';

const employeeStatusValues = ['active', 'suspended', 'terminated', 'retired', 'resigned'] as const;
const employeeTypeValues = ['Full-time', 'Part-time', 'Contractual'] as const;

export const FacultyDataSchema = z.object({
    departmentId: z.number().int().positive('Department ID must be a positive integer'),
    startDate: dateStringSchema,
    status: z.enum(employeeStatusValues).optional(),
    type: z.enum(employeeTypeValues),
});

export const RegisterFacultySchema = z.object({
    personalData: personSchema,
    facultyData: FacultyDataSchema,
});

export const UpdateFacultySchema = z.object({
    personalData: personSchema.partial(),
    facultyData: FacultyDataSchema.partial(),
}).refine((data) => Boolean(data.personalData) || Boolean(data.facultyData), {
    message: 'At least one of personalData or facultyData is required',
});
