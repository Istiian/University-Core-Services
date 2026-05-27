import { integer, pgTable, date } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { departments } from "./Department";
import { EmployeeStatus, EmployeeType } from "./Enum";
import {relations} from "drizzle-orm";

export const deans = pgTable('deans', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id).unique(),
    startDate: date('start_date').notNull(),
    departmentId: integer('department_id').notNull().references(() => departments.id),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull()
});

export const deansRelations = relations(deans, ({ one }) => ({
    person: one(persons),
    department: one(departments)
}));