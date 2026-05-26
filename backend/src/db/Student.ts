import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import {  StatusEnum, student_typeEnum } from "./Enum";
import { departments } from "./Department";
import { courses } from "./Course";

export const students = pgTable('students', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    enrollmentDate: date('enrollment_date').notNull(),
    departmentId: integer('department_id').notNull().references(() => departments.id),
    courseId: integer('course_id').notNull().references(() => courses.id),
    status: StatusEnum('status').notNull().default('active'),
    section: varchar('section', { length: 50 }).notNull(),
    studentType: student_typeEnum('student_type').notNull().default('regular'),
});





