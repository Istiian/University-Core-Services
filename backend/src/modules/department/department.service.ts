import { Department } from './department.type';
import { db } from '../../db/client';
import { departments } from '../../db/Department';
import { eq, and, ilike } from 'drizzle-orm';

export const createDepartment = async (deptData: Department) => {
    try {
        const result = await db.insert(departments).values({
            name: deptData.name,
        }).returning();
        return result[0];
    } catch (error) {
        throw new Error('Failed to create department');
    }
}

export const getDepartment = async (filter: Department) => {
    try {
        const whereClause: any = [];
        if (filter.departmentId) whereClause.push(eq(departments.departmentId, filter.departmentId));
        if (filter.name) whereClause.push(ilike(departments.name, `%${filter.name}%`));

        const result = await db.query.departments.findMany({
            where: and(...whereClause),
        });

        return result;
    } catch (error) {
        throw new Error('Failed to retrieve department');
    }
}

export const updateDepartment = async (departmentId: number, deptData: Department) => {
    try {
        const result = await db.update(departments).set({
            name: deptData.name,
        }).where(eq(departments.departmentId, departmentId)).returning();
        return result[0] || null;
    } catch (error) {
        throw new Error('Failed to update department');
    }
}

export const deleteDepartment = async (departmentId: number) => {
    try {
        const result = await db.delete(departments).where(eq(departments.departmentId, departmentId)).returning();
        return result[0] || null;
    } catch (error) {
        throw new Error('Failed to delete department');
    }
}
