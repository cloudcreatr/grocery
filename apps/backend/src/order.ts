import { z } from "zod";
import {
  protectedProcedure,
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
} from "@pkg/lib";
import { pubsub } from "./util/pubsub";
import { getDistanceFromLatLonInKm } from "./util/distance_formula";

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
          .where(eq(product.id, id))
          .get();
        if (!storeID) {
          throw new Error("Product not found");
        }
        await db.insert(orderItem).values({
          orderId: orderID[0].orderID,
          productId: id,
          storeID: storeID.id,
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
  storeSubscription: protectedProcedure.subscription(async function* (_) {
    for await (const data of pubsub.subscribe<Event>("store")) {
      yield data; // Yield the data to the subscriber
    }
  }),
  deliverySubscription: protectedProcedure.subscription(async function* (_) {
    for await (const data of pubsub.subscribe<Event>("delivery")) {
      yield data; // Yield the data to the subscriber
    }
  }),
  userSubscription: protectedProcedure.subscription(async function* (_) {
    for await (const data of pubsub.subscribe<Event>("user")) {
      yield data; // Yield the data to the subscriber
    }
  }),
  getWaitingOrders: protectedProcedure.query(async (op) => {
    const { db, user: U } = op.ctx;
    const waitingOrders = await db
      .select({
        store: {
          name: store.name,
          lat: store.lat,
          long: store.long,
        },
        product: {
          name: product.name,

          img: product.img,
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
      .innerJoin(store, eq(orderItem.storeID, store.id));
    const userLocation = db
      .select({
        lat: user.lat,
        long: user.long,
      })
      .from(user)
      .where(eq(user.id, U.id))
      .get();
    if (!userLocation || !userLocation.lat || !userLocation.long) {
      console.log(userLocation);
      throw new Error("User location not found");
    }

    const orders_with_distance = waitingOrders
      .map((order) => {
        if (!order.store.lat || !order.store.long) {
          throw new Error("Store location not found");
        }
        const d = getDistanceFromLatLonInKm(
          userLocation.lat!,
          userLocation.long!,
          order.store.lat,
          order.store.long
        );
        return {
          ...order,

          distance: d,
        };
      })
      .sort((a, b) => a.distance - b.distance);
    return orders_with_distance;
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
      await db
        .update(orderItem)
        .set({
          deliveryPartnerId,
          status: "assigned",
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
      await db
        .update(orderItem)
        .set({
          status: "picked",
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
  getOrderItemDetails: protectedProcedure
    .input(
      z.object({
        orderItemId: z.number(),
      })
    )
    .query(async (op) => {
      const { orderItemId } = op.input;
      const { db } = op.ctx;
      const orderDetails = await db
        .select({
          store,
          product,
          deliveryPartner: user,
        })
        .from(orderItem)
        .where(eq(orderItem.id, orderItemId))
        .innerJoin(product, eq(orderItem.productId, product.id))
        .innerJoin(store, eq(orderItem.storeID, store.id))
        .innerJoin(user, eq(orderItem.deliveryPartnerId, user.id));

      if (!orderDetails || orderDetails.length === 0) {
        throw new Error("Order not found");
      }
      return orderDetails;
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
