import { z } from "zod";
import {
  protectedProcedure,
  publicProcedure,
  router,
  storeProtectedProcedure,
} from "./util/trpc";
import {
  eq,
  orderItem,
  product,
  userOrder,
  and,
  isNull,
  user,
  store,
  sql,
  asc,
} from "@pkg/lib";
import { pubsub } from "./util/pubsub";

const arrayOfProducts = z.object({
  productId: z.number().array(),
});

type StoreInvalidation = {
  type: "store-invalidation";
};
type DeliveryInvalidation = {
  type: "delivery-invalidation";
};
type UserInvalidation = {
  type: "user-invalidation";
};
type Event = StoreInvalidation | DeliveryInvalidation | UserInvalidation;

export const order = router({
  createOrder: protectedProcedure
    .input(arrayOfProducts)
    .mutation(async (op) => {
      const { productId } = op.input;
      const { user, db } = op.ctx;
      const orderID = await db
        .insert(userOrder)
        .values({
          userId: user.id,
        })
        .returning({
          orderID: userOrder.id,
        });

      for (const id of productId) {
        const storeID = await db
          .select({
            id: product.storeId,
          })
          .from(product)
          .where(eq(product.id, id));

        if (!storeID) {
          throw new Error("Product not found");
        }
        await db.insert(orderItem).values({
          orderId: orderID[0].orderID,
          productId: id,
          storeID: storeID[0].id,
        });
      }

      //publish two events
      pubsub.publish<Event>("store", {
        type: "store-invalidation",
      });
      pubsub.publish<Event>("delivery", {
        type: "delivery-invalidation",
      });
      return {
        orderID: orderID[0].orderID,
      };
    }),
  storeSubscription: publicProcedure.subscription(async function* (_) {
    for await (const data of pubsub.subscribe<Event>("store")) {
      yield data; // Yield the data to the subscriber
    }
  }),
  deliverySubscription: publicProcedure.subscription(async function* (_) {
    for await (const data of pubsub.subscribe<Event>("delivery")) {
      yield data; // Yield the data to the subscriber
    }
  }),
  userSubscription: publicProcedure.subscription(async function* (_) {
    for await (const data of pubsub.subscribe<Event>("user")) {
      yield data; // Yield the data to the subscriber
    }
  }),
  getWaitingOrders: protectedProcedure.query(async (op) => {
    const { db } = op.ctx;
    const waitingOrders = await db
      .select({
        store: {
          lat: sql<number>`ST_Y(${user.location})`,
          long: sql<number>`ST_X(${user.location})`,
        },
        product: {
          name: product.name,

          price: product.price,
          img: product.img,
        },
        orderItem: {
          id: orderItem.id,
        },
      })
      .from(orderItem)
      .where(
        and(
          eq(orderItem.status, "waiting"),
          isNull(orderItem.deliveryPartnerId)
        )
      )
      .innerJoin(product, eq(orderItem.productId, product.id))
      .innerJoin(store, eq(orderItem.storeID, store.id))
      .innerJoin(userOrder, eq(orderItem.orderId, userOrder.id))
      .orderBy(
        asc(
          sql<number>`ST_Distance(${store.location}::geography, ${user.location}::geography)`
        )
      );

    return waitingOrders;
  }),
  assignOrder: protectedProcedure
    .input(
      z.object({
        orderItemId: z.number(),
        deliveryPartnerId: z.number(),
      })
    )
    .mutation(async (op) => {
      const { orderItemId, deliveryPartnerId } = op.input;
      const { db } = op.ctx;

      const StoreAndDeliveryPartner = await Promise.allSettled([
        db
          .select({
            lat: sql<number>`ST_Y(${store.location})`,
            long: sql<number>`ST_X(${store.location})`,
          })
          .from(orderItem)
          .where(eq(orderItem.id, orderItemId))
          .innerJoin(store, eq(orderItem.storeID, store.id)),
        db
          .select({
            lat: sql<number>`ST_Y(${user.location})`,
            long: sql<number>`ST_X(${user.location})`,
          })
          .from(user)
          .where(eq(user.id, deliveryPartnerId)),
      ]);
      console.log("Store and Delivery Partner", StoreAndDeliveryPartner);
      if (
        StoreAndDeliveryPartner[0].status === "rejected" ||
        !StoreAndDeliveryPartner[0].value
      ) {
        throw new Error("Store not found");
      }
      if (
        StoreAndDeliveryPartner[1].status === "rejected" ||
        !StoreAndDeliveryPartner[1].value
      ) {
        throw new Error("Delivery partner not found");
      }
      const storeDetails = StoreAndDeliveryPartner[0];
      const deliveryPartnerDetails = StoreAndDeliveryPartner[1];

      await db
        .update(orderItem)
        .set({
          deliveryPartnerId,
          status: "assigned",
          location: {
            destination: {
              lat: storeDetails.value[0]?.lat || 0,
              long: storeDetails.value[0]?.long || 0,
            },
            source: {
              lat: deliveryPartnerDetails.value[0]?.lat || 0,
              long: deliveryPartnerDetails.value[0]?.long || 0,
            },
          },
        })
        .where(eq(orderItem.id, orderItemId));
      //publish two events
      pubsub.publish<Event>("user", {
        type: "user-invalidation",
      });
      pubsub.publish<Event>("delivery", {
        type: "delivery-invalidation",
      });
      pubsub.publish<Event>("store", {
        type: "store-invalidation",
      });

      return {
        message: "Order assigned",
      };
    }),
  pickupOrder: protectedProcedure
    .input(
      z.object({
        orderItemId: z.number(),
      })
    )
    .mutation(async (op) => {
      const { orderItemId } = op.input;
      const { db } = op.ctx;

      const orderItemDetails = await db
        .select()
        .from(orderItem)
        .where(eq(orderItem.id, orderItemId));
      if (orderItemDetails.length === 0) {
        throw new Error("Order not found");
      }

      const storeAnduser = await db
        .select({
          store: {
            lat: sql<number>`ST_Y(${store.location})`,
            long: sql<number>`ST_X(${store.location})`,
          },
          user: {
            lat: sql<number>`ST_Y(${user.location})`,
            long: sql<number>`ST_X(${user.location})`,
          },
        })
        .from(orderItem)
        .where(eq(orderItem.id, orderItemId))
        .innerJoin(store, eq(orderItem.storeID, store.id))
        .innerJoin(userOrder, eq(orderItem.orderId, userOrder.id))
        .innerJoin(user, eq(userOrder.userId, user.id));

      await db
        .update(orderItem)
        .set({
          status: "picked",
          location: {
            destination: {
              lat: storeAnduser[0]?.user.lat || 0,
              long: storeAnduser[0]?.user.long || 0,
            },
            source: {
              lat: storeAnduser[0]?.store.lat || 0,
              long: storeAnduser[0]?.store.long || 0,
            },
          },
        })
        .where(eq(orderItem.id, orderItemId));

      //publish two events
      pubsub.publish<Event>("user", {
        type: "user-invalidation",
      });
      pubsub.publish<Event>("delivery", {
        type: "delivery-invalidation",
      });
      pubsub.publish<Event>("store", {
        type: "store-invalidation",
      });

      return {
        message: "Order picked",
      };
    }),
  completeOrder: protectedProcedure
    .input(
      z.object({
        orderItemId: z.number(),
      })
    )
    .mutation(async (op) => {
      const { orderItemId } = op.input;
      const { db } = op.ctx;

      await db
        .update(orderItem)
        .set({
          status: "delivered",
        })
        .where(eq(orderItem.id, orderItemId));
      //publish two events
      pubsub.publish<Event>("user", {
        type: "user-invalidation",
      });
      pubsub.publish<Event>("delivery", {
        type: "delivery-invalidation",
      });
      pubsub.publish<Event>("store", {
        type: "store-invalidation",
      });

      return {
        message: "Order completed",
      };
    }),
  getDeliveryPartnerDetails: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async (op) => {
      const { id } = op.input;
      const { db } = op.ctx;
      const deliveryPartnerDetails = await db
        .select()
        .from(user)
        .where(eq(user.id, id));
      if (deliveryPartnerDetails.length === 0) {
        throw new Error("Delivery partner not found");
      }
      return deliveryPartnerDetails[0];
    }),
  getOrderItemDetails: protectedProcedure
    .input(
      z.object({
        orderItemId: z.number(),
      })
    )
    .query(async (op) => {
      const { orderItemId } = op.input;
      const { db } = op.ctx;
      console.log("Order Item ID", orderItemId);
      const orderDetails = await db
        .select()
        .from(orderItem)
        .where(eq(orderItem.id, orderItemId))
        .innerJoin(store, eq(orderItem.storeID, store.id))
        .innerJoin(product, eq(orderItem.productId, product.id))
        .innerJoin(userOrder, eq(orderItem.orderId, userOrder.id))
        .innerJoin(user, eq(userOrder.userId, user.id));

      if (orderDetails.length === 0) {
        throw new Error("Order not found");
      }
      return orderDetails[0];
    }),
  getOrdersByDeliveryPartner: protectedProcedure.query(async (op) => {
    const { db, user: U } = op.ctx;
    const orders = await db
      .select({
        orderItem,
        product,
        store,
      })
      .from(orderItem)
      .where(eq(orderItem.deliveryPartnerId, U.id))
      .innerJoin(product, eq(orderItem.productId, product.id))
      .innerJoin(store, eq(orderItem.storeID, store.id));
    return orders;
  }),
  getOrdersByStore: storeProtectedProcedure.query(async (op) => {
    const { db, storeDetails } = op.ctx;
    const orders = await db
      .select({
        orderItem: orderItem,
        product,
      })
      .from(orderItem)
      .where(eq(orderItem.storeID, storeDetails.id))
      .innerJoin(product, eq(orderItem.productId, product.id));

    return orders;
  }),

  getOrdersByUser: protectedProcedure.query(async (op) => {
    const { db, user: U } = op.ctx;
    const orders = await db
      .select()
      .from(userOrder)
      .where(eq(userOrder.userId, U.id));

    // Use Promise.all to wait for all promises in the map to resolve
    const result = await Promise.all(
      orders.map(async (o) => {
        const data = await db
          .select({
            product: product,
            orderItem: orderItem,
          })
          .from(orderItem)
          .where(eq(orderItem.orderId, o.id))
          .innerJoin(product, eq(orderItem.productId, product.id));

        // Structure the return object for each order
        return {
          userOrder: o, // Include the original order details
          items: data.map((d) => ({
            // Map the fetched items
            product: d.product,
            orderItem: d.orderItem,
          })),
        };
      })
    );

    return result; // Now returns the array of resolved order objects
  }),
});
