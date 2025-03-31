import {
  blob,
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

interface Doc {
  id: string[];
}
export const user = sqliteTable("user", {
  id: integer().primaryKey(),
  email: text().unique().notNull(),
  name: text(),
  doc: blob({ mode: "json" }).$type<Doc>(),
  phone: text(),
  address: text(),
  lat: real(),
  long: real(),
});
