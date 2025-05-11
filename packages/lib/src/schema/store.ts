import {
  geometry,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { z } from "zod";
export const store = pgTable(
  "store",
  {
    id: serial().primaryKey(),
    name: text(),
    description: text(),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id),
    img: text(),

    location: geometry("looction", { type: "point", mode: "xy", srid: 4326 }),
    address: text(),
  },
  (t) => [index("store_location_index").using("gist", t.location)]
);

const IndianBankDetailsSchema = z.object({
  IFSC: z.string(),
  AccountNumber: z.string(),
  BankName: z.string(),
  BranchName: z.string(),
  UPI: z.string(),
});

type IndianBankDetails = z.infer<typeof IndianBankDetailsSchema>;

export const bank = pgTable("bank", {
  id: serial().primaryKey(),
  userid: integer("user_id")
    .notNull()
    .references(() => user.id),
  details: jsonb()
    .$type<IndianBankDetails>()
    .$defaultFn(() => {
      return {
        IFSC: "",
        AccountNumber: "",
        BankName: "",
        BranchName: "",
        UPI: "",
      };
    })
    .notNull(),
});

interface ProductImg {
  imgID: string[];
}

export const category = pgTable("category", {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),

  img: text(),
});

export const product = pgTable("product", {
  id: serial().primaryKey(),
  name: text(),
  description: text(),
  categoryID: integer("category_id").references(() => category.id),

  storeId: integer("store_id")
    .notNull()
    .references(() => store.id),
  img: jsonb().$type<ProductImg>(),
  price: real(),
});
