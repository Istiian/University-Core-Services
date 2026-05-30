import { integer, pgTable, date, serial } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import {courses} from "./Course";
import { EmployeeStatus, EmployeeType } from "./Enum";

export const programChairs = pgTable('program_chairs', {
    programChairId: serial('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.personId, {onDelete: 'cascade'}).unique(),
    courseId: integer('course_id').notNull().references(() => courses.courseId),
    startDate: date('start_date').notNull(),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull()
});





