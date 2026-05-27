import bcrypt from 'bcrypt';
import { persons } from '../../db/Person';
import { eq } from 'drizzle-orm';
import { db } from "../../../index";

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const checkUserExists = async (email: string): Promise<boolean> => {
    const existingUser = await db.select().from(persons).where(eq(persons.email, email));
    console.log("Existing user check result:", existingUser);
    return existingUser.length > 0;
}