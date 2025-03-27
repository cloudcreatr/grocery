import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: integer().primaryKey(),
  email: text().unique().notNull(),
});
