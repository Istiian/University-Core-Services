import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { EmployeeStatus, EmployeeType } from "./Enum";
import { departments } from "./Department";
import {relations} from "drizzle-orm";

export const faculty = pgTable('faculty', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    personId: integer('person_id').notNull().references(() => persons.id).unique(),
    startDate: date('start_date').notNull(),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull(),
    departmentId: integer('department_id').notNull().references(() => departments.id),
});

export const facultyRelations = relations(faculty, ({ one }) => ({
    person: one(persons),
    department: one(departments)
}));