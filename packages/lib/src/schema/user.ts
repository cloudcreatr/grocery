import { geometry, serial } from "drizzle-orm/pg-core";
import {
  jsonb,
  index,
  integer,
  real,
  text,
  pgTable,
} from "drizzle-orm/pg-core";

interface Doc {
  id: string[];
}
export const user = pgTable(
  "user",
  {
    id: serial().primaryKey(),
    email: text().unique().notNull(),
    name: text(),
    doc: jsonb().$type<Doc>(),
    phone: text(),
    address: text(),

    location: geometry("loction", { type: "point", mode: "xy", srid: 4326 }),
  },
  (t) => [index("user_location_index").using("gist", t.location)]
);
