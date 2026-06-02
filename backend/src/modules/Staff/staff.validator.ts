import z from "zod";
import { personSchema, passwordSchema, dateStringSchema } from "../common.validator";

const employeeStatusValues = ["active", "suspended", "terminated", "retired", "resigned"] as const;
const employeeTypeValues = ["Full-time", "Part-time", "Contractual"] as const;


export const StaffDataSchema = z.object({
    officeId: z.number().int().positive("Office ID must be a positive integer"),
    startDate: dateStringSchema,
    status: z.enum(employeeStatusValues).optional(),
    type: z.enum(employeeTypeValues),
});

export const RegisterStaffSchema = z.object({
    personalData: personSchema,
    staffData: StaffDataSchema,
});

export const UpdateStaffSchema = z.object({
    personalData: personSchema.partial(),
    staffData: StaffDataSchema.partial(),
}).refine((data) => Boolean(data.personalData) || Boolean(data.staffData), {
    message: "At least one of personalData or staffData is required",
});

