import z from 'zod';
import { dateStringSchema, personSchema } from '../common.validator';

const employeeStatusValues = ['active', 'suspended', 'terminated', 'retired', 'resigned'] as const;
const employeeTypeValues = ['Full-time', 'Part-time', 'Contractual'] as const;

export const AdminDataSchema = z.object({
    officeId: z.number().int().positive('Office ID must be a positive integer'),
    startDate: dateStringSchema,
    status: z.enum(employeeStatusValues).optional(),
    type: z.enum(employeeTypeValues),
});

export const RegisterAdminSchema = z.object({
    personalData: personSchema,
    adminData: AdminDataSchema,
});

export const UpdateAdminSchema = z.object({
    personalData: personSchema.partial(),
    adminData: AdminDataSchema.partial(),
}).refine((data) => Boolean(data.personalData) || Boolean(data.adminData), {
    message: 'At least one of personalData or adminData is required',
});