import zod from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const CreateUserRequestSchema = zod.object({
    firstName: zod.string().min(1, 'First name is required'),
    lastName: zod.string().min(1, 'Last name is required'),
    middleName: zod.string().optional(),
    birthDate: zod.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, { message: 'Invalid date format' }),
    gender: zod.enum(['Male', 'Female', 'Other'], { message: 'Invalid gender value' }),
    email: zod.string().email('Invalid email format'),
    contactNumber: zod.string().min(1, 'Contact number is required'),
    houseNumber: zod.string().min(1, 'House number is required'),
    street: zod.string().min(1, 'Street is required'),
    barangay: zod.string().min(1, 'Barangay is required'),
    cityMunicipality: zod.string().min(1, 'City/Municipality is required'),
    region: zod.string().min(1, 'Region is required'),
    province: zod.string().min(1, 'Province is required'),
    role: zod.enum(['Student', 'Staff', 'Faculty', 'Admin', 'Super Admin'], { message: 'Invalid role value' })
});