import z from "zod";
import { personSchema, passwordSchema, dateStringSchema} from "../common.validator";

const studentStatusValues = ["active", "graduated", "dropped", "suspended"] as const;
const studentTypeValues = ["regular", "irregular"] as const;

const studentDataSchema = z.object({
    enrollmentDate: dateStringSchema,
    courseId: z.number().int().positive("Course ID must be a positive integer"),
    status: z.enum(studentStatusValues).optional(),
    studentType: z.enum(studentTypeValues),
});

const updatePersonSchema = personSchema.partial();
const updateStudentDataSchema = studentDataSchema.partial();

export const registerStudentSchema = z.object({
    personalData: personSchema,
    studentData: studentDataSchema,
});

export const updateStudentSchema = z.object({
    personalData: updatePersonSchema.optional(),
    studentData: updateStudentDataSchema.optional(),
}).refine((data) => data.personalData || data.studentData, {
    message: "At least one of personalData or studentData is required",
});

