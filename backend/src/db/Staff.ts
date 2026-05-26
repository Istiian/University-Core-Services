import { integer, pgTable, date } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { StatusEnum } from "./Enum";
import { offices } from "./Office";


export const staff = pgTable('staff', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    officeId: integer('office_id').notNull().references(() => offices.id),
    hireDate: date('hire_date').notNull(),
    status: StatusEnum('status').notNull().default('active'),
});



