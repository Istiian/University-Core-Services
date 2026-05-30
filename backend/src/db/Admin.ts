import { integer, pgTable, date, serial } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { EmployeeStatus, EmployeeType } from "./Enum";
import { offices } from "./Office";

export const admins = pgTable('admins', {
    adminId: serial('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.personId,{onDelete: 'cascade'}).unique(),
    officeId: integer('office_id').notNull().references(() => offices.officeId),
    startDate: date('start_date').notNull(),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull()
});
