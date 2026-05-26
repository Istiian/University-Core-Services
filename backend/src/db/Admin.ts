import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { StatusEnum} from "./Enum";

export const admins = pgTable('admins', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    office: varchar('office', { length: 255 }).notNull(),
    hireDate: date('hire_date').notNull(),
    status: StatusEnum('status').notNull().default('active'),
});

