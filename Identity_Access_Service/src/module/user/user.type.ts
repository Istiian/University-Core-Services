
import { InferInsertModel } from "drizzle-orm";
import { user } from "../../db/schema";

export type RegisterUser = Omit<InferInsertModel<typeof user>, 'userId' | 'password'> & {
    confirmPassword: string;
}

export type UpdateUserInfo = Partial<Omit<InferInsertModel<typeof user>, 'userId' | 'password' | 'username'| 'role'>>

export type ListFilters={
    search?: string;
    role?: "Student" | "Faculty" | "Staff" | "Admin" | "SuperAdmin" | "Self";
}