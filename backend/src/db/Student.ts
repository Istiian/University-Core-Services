import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { courseEnum, StatusEnum,  student_typeEnum, departmentEnum } from "./Enum";

export const students = pgTable('students', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    enrollmentDate: date('enrollment_date').notNull(),
    department: departmentEnum('department').notNull(),
    course: courseEnum('course').notNull(),
    status: StatusEnum('status').notNull().default('active'),
    section: varchar('section', { length: 50 }).notNull(),
    studentType: student_typeEnum('student_type').notNull().default('regular'),
});





