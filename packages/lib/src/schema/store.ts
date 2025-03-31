import {
  blob,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { user } from "./user";

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

export interface IndianBankDetails {
  IFSC: string;

  AccountNumber: string;
  BankName: string;
  BranchName: string;
  UPI: string;
}

export const bank = sqliteTable("bank", {
  id: integer().primaryKey(),
  userid: integer("user_id")
    .notNull()
    .references(() => user.id),
  details: blob({ mode: "json" }).$type<IndianBankDetails>(),
});

interface ProductImg {
  imgID: string[];
}

export const category = [
  "clothes",
  "electronics",
  "furniture",
  "toys",
  "books",
] as const;

export const product = sqliteTable("product", {
  id: integer().primaryKey(),
  name: text(),
  description: text(),
  category: text({ enum: category }),

  storeId: integer("store_id")
    .notNull()
    .references(() => store.id),
  img: blob({ mode: "json" }).$type<ProductImg>(),
  price: real(),
});
