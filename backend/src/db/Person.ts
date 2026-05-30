import { pgTable, varchar, date, serial } from "drizzle-orm/pg-core";
import { personRole } from "./Enum";

export const persons = pgTable('persons', {
    personId: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),
    birthDate: date('birth_date').notNull(),
    contactNumber: varchar('contact_number', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    houseNumber: varchar('house_number', { length: 255 }).notNull(),
    street: varchar('street', { length: 255 }).notNull(),
    barangay: varchar('barangay', { length: 255 }).notNull(),
    cityMunicipality: varchar('city_municipality', { length: 255 }).notNull(),
    region: varchar('region', { length: 255 }).notNull(),
    province: varchar('province', { length: 255 }).notNull(),
    role: personRole('role').notNull(),
});




