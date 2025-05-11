import { integer, jsonb, serial, text } from "drizzle-orm/pg-core";
import { user } from "./user";
import { product, store } from "./store";
import { pgTable } from "drizzle-orm/pg-core";

export const userOrder = pgTable("user_order", {
  id: serial().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
});

export type OrderStatus = "waiting" | "assigned" | "picked" | "delivered";
export type DeliveryLoactions = {
  destination: {
    lat: number;
    long: number;
  };
  source: {
    lat: number;
    long: number;
  };
};
export const orderItem = pgTable("order_item", {
  id: serial().primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => userOrder.id),
  productId: integer("product_id")
    .notNull()
    .references(() => product.id),
  storeID: integer("store_id")
    .notNull()
    .references(() => store.id),
  deliveryPartnerId: integer("delivery_partner_id").references(() => user.id),
  status: text({
    enum: ["waiting", "assigned", "picked", "delivered"],
  }).$defaultFn(() => "waiting"),

  location: jsonb().$type<DeliveryLoactions>(),
});
