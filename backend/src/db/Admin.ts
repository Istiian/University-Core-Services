import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import { OfficeEnum, StatusEnum} from "./Enum";

export const admins = pgTable('admins', {
    id: integer('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id),
    office: OfficeEnum('office').notNull(),
    hireDate: date('hire_date').notNull(),
    status: StatusEnum('status').notNull().default('active'),
});

