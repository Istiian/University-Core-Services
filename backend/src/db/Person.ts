import { integer, pgTable, varchar, date } from "drizzle-orm/pg-core";

export const persons = pgTable('persons', {
    id: integer('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),
    birthDate: date('birth_date').notNull(),
    contactNumber: varchar('contact_number', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
});