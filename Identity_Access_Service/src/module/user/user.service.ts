import { user } from "../../db/user";
import { db } from "../../db/client"
import { RegisterUser, UpdateUserInfo, ListFilters} from "./user.type";
import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../lib/bcrypt";
import {desc, eq, and, ne, or, ilike} from "drizzle-orm";
import { randomBytes } from "crypto";

export const createUser = async (userData: RegisterUser) => {
    const existingUser = await db.select()
        .from(user)
        .where(eq(user.email, userData.email))
        .limit(1);
    if (existingUser.length > 0) {
        throw new AppError('Email already exists', 400);
    }
    const [lastRow] = await db
      .select()
      .from(user)
      .orderBy(desc(user.userId))
      .limit(1);
    
    const generatedUsername = `${userData.lastName.toUpperCase()}${new Date().getFullYear()}${(lastRow?.userId || 0) + 1}`;
    const generatedPassword = randomBytes(16).toString('base64').slice(0, 16);
    const hashedPassword = await hashPassword(generatedPassword);
    const insertData = {...userData, username: generatedUsername, password: hashedPassword};
    await db.insert(user).values(insertData)
    
    return {
        username: generatedUsername,
        password: generatedPassword
    };
}

export const updateUserInfo = async (userId: number, userData: UpdateUserInfo) => {
    if (userData.email) {
        const checkEmail = await db.select()
            .from(user)
            .where(and(eq(user.email, userData.email), ne(user.userId, userId)))
            .limit(1);
        if (checkEmail.length > 0) throw new AppError('Email already exists', 400);
    }
    
    const [updatedUser] = await db
        .update(user)
        .set(userData)
        .where(eq(user.userId, userId))
        .returning({
            userId: user.userId,  firstName: user.firstName,
            lastName: user.lastName, middleName: user.middleName,
            birthDate: user.birthDate, email: user.email,
            contactNumber: user.contactNumber,houseNumber: user.houseNumber,
            street: user.street, barangay: user.barangay, cityMunicipality: user.cityMunicipality,
            region: user.region, province: user.province
        });
    return updatedUser;
};

export const getUserById = async (userId: number) => {
    const [userInfo] = await db.select()
        .from(user)
        .where(eq(user.userId, userId))
        .limit(1);
    if (!userInfo) throw new AppError('User not found', 404);
    return userInfo;
};

export const listUsers = async (page: number, limit: number, filters: ListFilters) => {
    const whereClause= []
    if (filters.search) {
        whereClause.push(or(
            ilike(user.firstName, `%${filters.search}%`),
            ilike(user.lastName, `%${filters.search}%`),
            ilike(user.email, `%${filters.search}%`),
            ilike(user.username, `%${filters.search}%`)
        ));
    }
    const validRoles = ["Student", "Faculty", "Staff", "Admin", "SuperAdmin"];
    if (filters.role && validRoles.includes(filters.role)) {
        whereClause.push(eq(user.role, filters.role));
    }else{
        throw new AppError('Invalid role filter', 400);
    }
    const users = await db.select()
        .from(user)
        .where(and(...whereClause))
        .orderBy(desc(user.userId))
        .limit(limit)
        .offset((page - 1) * limit);
    return users;
}
