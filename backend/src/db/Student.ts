import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import {  StudentStatus, StudentType } from "./Enum";
import { courses } from "./Course";
import { relations } from "drizzle-orm";

export const students = pgTable('students', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    personId: integer('person_id').notNull().references(() => persons.id).unique(),
    enrollmentDate: date('enrollment_date').notNull(),
    courseId: integer('course_id').notNull().references(() => courses.id),
    status: StudentStatus('status').notNull().default('active'),
    section: varchar('section', { length: 50 }).notNull(),
    studentType: StudentType('student_type').notNull().default('regular'),
});

export const studentsRelations = relations(students, ({ one }) => ({
    person: one(persons),
    course: one(courses)
}));





