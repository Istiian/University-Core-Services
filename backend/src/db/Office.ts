import { integer, pgTable, varchar} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { admins } from "./Admin";
import { staff } from "./Staff";

export const offices = pgTable('offices', {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    name: varchar('name', { length: 255 }).notNull().unique(),
});

export const officesRelations = relations(offices, ({ many }) => ({
    admins: many(admins),
    staff: many(staff)
}));

