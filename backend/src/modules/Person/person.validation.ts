import z from "zod"

const personSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    middleName: z.string().nullable(),
    birthDate: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format"),
    contactNumber: z.string().min(1, "Contact number is required").max(20, "Contact number must be at most 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    repeatPassword: z.string().min(6, "Repeat password must be at least 6 characters"),
    address: z.object({
        houseNumber: z.string().min(1, "House number is required"),
        street: z.string().min(1, "Street is required"),
        barangay: z.string().min(1, "Barangay is required"),
        cityMunicipality: z.string().min(1, "City is required"),
        region: z.string().min(1, "Region is required"),
        province: z.string().min(1, "Province is required"),
    })
});

const Staff = z.object({
    officeId: z.number().int().positive("Office ID must be a positive integer"),
    startDate: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format"),
    status: z.enum(["active", "inactive", "terminated"]).optional(),
    type: z.enum(["full-time", "part-time", "contract"])
});

const Student = z.object({
    enrollmentDate: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format"),
    courseId: z.number().int().positive("Course ID must be a positive integer"),
    status: z.enum(["active", "inactive", "graduated"]).optional(),
    section: z.string().min(1, "Section is required"),
    studentType: z.enum(["regular", "irregular"])
});

const Admin = z.object({
    officeId: z.number().int().positive("Office ID must be a positive integer"),
    startDate: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format"),
    status: z.enum(["active", "inactive", "terminated"]).optional(),
    type: z.enum(["full-time", "part-time", "contract"])
});

const Faculty = z.object({
    startDate: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format"),
    status: z.enum(["active", "inactive", "terminated"]).optional(),
    type: z.enum(["full-time", "part-time", "contract"]),
    departmentId: z.number().int().positive("Department ID must be a positive integer")
});

const Dean = z.object({
    startDate: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format"),
    departmentId: z.number().int().positive("Department ID must be a positive integer"),
    status: z.enum(["active", "inactive", "terminated"]).optional(),
    type: z.enum(["full-time", "part-time", "contract"])
});

const ProgramChair = z.object({
    courseId: z.number().int().positive("Course ID must be a positive integer").optional(),
    startDate: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, "Invalid date format"),
    status: z.enum(["active", "inactive", "terminated"]).optional(),
    type: z.enum(["full-time", "part-time", "contract"])
});

export const registerStudentSchema = z.object({
    personalData: personSchema.extend({
        role: z.literal("student")
    }),
    studentData: Student
});

export const registerStaffSchema = z.object({
    personalData: personSchema.extend({
        role: z.literal("staff")
    }),
    staffData: Staff
});

export const registerFacultySchema = z.object({
    personalData: personSchema.extend({
        role: z.literal("faculty")
    }),
    facultyData: Faculty
});

export const registerAdminSchema = z.object({
    personalData: personSchema.extend({
        role: z.literal("admin")
    }),
    adminData: Admin
});

export const registerDeanSchema = z.object({
    personalData: personSchema.extend({
        role: z.literal("dean")
    }),
    deanData: Dean
});

export const registerProgramChairSchema = z.object({
    personalData: personSchema.extend({
        role: z.literal("program-chair")
    }),
    programChairData: ProgramChair
});