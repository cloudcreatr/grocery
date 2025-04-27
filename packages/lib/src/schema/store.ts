import {
  blob,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { user } from "./user";
import { z } from "zod";
export const store = sqliteTable("store", {
  id: integer().primaryKey(),
  name: text(),
  description: text(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  img: text(),
  lat: real(),
  long: real(),
  address: text(),
});

const IndianBankDetailsSchema = z.object({
  IFSC: z.string(),
  AccountNumber: z.string(),
  BankName: z.string(),
  BranchName: z.string(),
  UPI: z.string(),
});

type IndianBankDetails = z.infer<typeof IndianBankDetailsSchema>;

export const bank = sqliteTable("bank", {
  id: integer().primaryKey(),
  userid: integer("user_id")
    .notNull()
    .references(() => user.id),
  details: blob({ mode: "json" })
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

export const category = sqliteTable("category", {
  id: integer().primaryKey(),
  name: text().notNull(),
  description: text(),

  img: text(),
});

export const product = sqliteTable("product", {
  id: integer().primaryKey(),
  name: text(),
  description: text(),
  categoryID: integer("category_id").references(() => category.id),

  storeId: integer("store_id")
    .notNull()
    .references(() => store.id),
  img: blob({ mode: "json" }).$type<ProductImg>(),
  price: real(),
});
