import { pgTable, serial, varchar,  } from "drizzle-orm/pg-core";


export const departments = pgTable('departments', {
    departmentId: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
});

