import z from 'zod';
import { personSchema, dateStringSchema } from '../common.validator';

const employeeStatusValues = ['active', 'suspended', 'terminated', 'retired', 'resigned'] as const;
const employeeTypeValues = ['Full-time', 'Part-time', 'Contractual'] as const;

export const DeanDataSchema = z.object({
    departmentId: z.number().int().positive('Department ID must be a positive integer'),
    startDate: dateStringSchema,
    status: z.enum(employeeStatusValues).optional(),
    type: z.enum(employeeTypeValues),
});

export const RegisterDeanSchema = z.object({
    personalData: personSchema,
    deanData: DeanDataSchema,
});

export const UpdateDeanSchema = z.object({
    personalData: personSchema.partial(),
    deanData: DeanDataSchema.partial(),
}).refine((data) => Boolean(data.personalData) || Boolean(data.deanData), {
    message: 'At least one of personalData or deanData is required',
});