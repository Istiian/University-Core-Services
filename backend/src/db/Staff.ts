import { integer, pgTable, date } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { EmployeeStatus, EmployeeType } from "./Enum";
import { offices } from "./Office";
import { relations } from "drizzle-orm";

export const staff = pgTable('staff', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    personId: integer('person_id').notNull().references(() => persons.id).unique(),
    officeId: integer('office_id').notNull().references(() => offices.id),
    startDate: date('start_date').notNull(),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull()
});

export const staffRelations = relations(staff, ({ one, many }) => ({
    person: one(persons),
    office: many(offices)
}));


