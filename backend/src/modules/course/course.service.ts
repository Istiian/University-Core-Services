import { Course } from './course.type';
import { db } from '../../db/client';
import { courses } from '../../db/Course';
import { eq, and, ilike} from 'drizzle-orm';

export const createCourse = async (courseData: Course)=> {
    try {
        const result = await db.insert(courses).values({
            name: courseData.name,
            departmentId: courseData.departmentId,
        }).returning();
        return result[0];
    } catch (error) {
        throw new Error('Failed to create course');
    }
}


export const getCourse = async (filter: Course) => {
    try {
        const whereClause: any = [];
        console.log('Filter:', filter);
        if (filter.courseId) whereClause.push(eq(courses.courseId, filter.courseId));
        if (filter.name) whereClause.push(ilike(courses.name, `%${filter.name}%`));
        if (filter.departmentId) whereClause.push(eq(courses.departmentId, filter.departmentId));

        const result = await db.query.courses.findMany({
            where: and(...whereClause),
        });

        return result;
    } catch (error) {
        throw new Error('Failed to retrieve course');
    }
}

export const updateCourse = async (courseId: number, courseData: Course) => {
    try {
        const result = await db.update(courses).set({
            name: courseData.name,
            departmentId: courseData.departmentId,
        }).where(eq(courses.courseId, courseId)).returning();
        return result[0] || null;
    } catch (error) {
        throw new Error('Failed to update course');
    }
}

export const deleteCourse = async (courseId: number) => {
    try {
        const result = await db.delete(courses).where(eq(courses.courseId, courseId)).returning();
        return result[0] || null;
    } catch (error) {
        throw new Error('Failed to delete course');
    }
}
