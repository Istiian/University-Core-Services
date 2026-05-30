import { integer, pgTable, varchar, date, pgEnum, serial } from "drizzle-orm/pg-core";
import { departments } from "./Department";


export const courses = pgTable('courses', {
    courseId: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    departmentId: integer('department_id').notNull().references(() => departments.departmentId),
});
