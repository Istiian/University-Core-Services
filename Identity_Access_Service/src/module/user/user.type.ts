
import { InferInsertModel } from "drizzle-orm";
import { user } from "../../db/schema";
// export type gender = 'Male' | 'Female' | 'Other';

// export type role =  'Student' | 'Faculty' | 'Staff' | 'Admin' | 'SuperAdmin';

// export type User = {
//     userId: number;
//     firstName: string;
//     lastName: string;
//     middleName?: string;
//     birthDate: string;
//     gender: gender;
//     email: string;
//     contactNumber?: string;
//     username: string;
//     password: string;
//     houseNumber: string;
//     street: string;
//     barangay: string;
//     cityMunicipality: string;
//     region: string;
//     province: string;
//     role: role;
// }

export type RegisterUser = Omit<InferInsertModel<typeof user>, 'userId' | 'password'> & {
    confirmPassword: string;
}

export type UpdateUserInfo = Partial<Omit<InferInsertModel<typeof user>, 'userId' | 'password' | 'username'| 'role'>>

export type ListFilters={
    search?: string;
    role?: "Student" | "Faculty" | "Staff" | "Admin" | "SuperAdmin";
}