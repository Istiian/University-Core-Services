import { integer, pgTable, date } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import {courses} from "./Course";
import { EmployeeStatus, EmployeeType } from "./Enum";
import {relations} from "drizzle-orm";

export const programChairs = pgTable('program_chairs', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    personId: integer('person_id').notNull().references(() => persons.id).unique(),
    courseId: integer('course_id').notNull().references(() => courses.id),
    startDate: date('start_date').notNull(),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull()
});

export const programChairsRelations = relations(programChairs, ({ one }) => ({
    person: one(persons),
    course: one(courses)
}));





