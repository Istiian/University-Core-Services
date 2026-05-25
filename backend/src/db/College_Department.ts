import { integer, pgTable, varchar, date, pgEnum } from "drizzle-orm/pg-core";

export const departments = pgTable('departments', {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
});