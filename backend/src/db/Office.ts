import { integer, pgTable, varchar} from "drizzle-orm/pg-core";

export const offices = pgTable('offices', {
    id: integer('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
});