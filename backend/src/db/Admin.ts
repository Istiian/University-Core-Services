import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { EmployeeStatus, EmployeeType } from "./Enum";
import { relations } from "drizzle-orm";
import { offices } from "./Office";

export const admins = pgTable('admins', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id).unique(),
    officeId: integer('office_id').notNull().references(() => offices.id),
    startDate: date('start_date').notNull(),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull()
});

export const adminsRelations = relations(admins, ({ one, many}) => ({
    person: one(persons),
    office: many(offices)
}));