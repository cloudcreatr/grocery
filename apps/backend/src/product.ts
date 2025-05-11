import {
  eq,
  product,
  and,
  store,
  productAvailable,
  asc,
  distanceSort,
  like,
} from "@pkg/lib";
import {
  protectedProcedure,
  router,
  storeProtectedProcedure,
} from "./util/trpc";
import { z } from "zod";
import { ProductModifySchema } from "./export";

export const productRoute = router({
  createProduct: storeProtectedProcedure
    .input(ProductModifySchema.omit({ id: true }))
    .mutation(async (opts) => {
      const { db, storeDetails } = opts.ctx;
      const { name, description, price, productAvailable, img } = opts.input;

      const id = await db
        .insert(product)
        .values({
          storeId: storeDetails.id,
          name,
          description,
          price: parseFloat(price ?? "0"),
          productAvailable,
          img:
            img && img.uploadedFiles.length > 0
              ? {
                  imgID: img.uploadedFiles,
                }
              : null,
        })
        .returning({
          id: product.id,
        });
      return {
        id: id[0].id,
      };
    }),
  getProduct: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
      })
    )
    .query(async (opts) => {
      const { productId } = opts.input;
      const { db } = opts.ctx;

      const productData = await db
        .select()
        .from(product)
        .where(eq(product.id, productId));

      if (productData[0].productAvailable) {
        const recommendedProduct = await db
          .select()
          .from(product)
          .where(eq(product.productAvailable, productData[0].productAvailable));

        return {
          product: productData[0],

          recommendedProduct: recommendedProduct,
        };
      }
      return {
        product: productData[0],
        recommendedProduct: [],
      };
    }),
  modifyProduct: storeProtectedProcedure
    .input(ProductModifySchema)
    .mutation(async (opts) => {
      const { id, name, description, price, productAvailable, img } =
        opts.input;
      const { db, storeDetails } = opts.ctx;

      await db
        .update(product)
        .set({
          name,
          description,
          price: parseFloat(price ?? "0"),
          productAvailable: productAvailable,
          img:
            img && img.uploadedFiles.length > 0
              ? {
                  imgID: img.uploadedFiles,
                }
              : null,
        })
        .where(and(eq(product.id, id), eq(product.storeId, storeDetails.id)));

      return {
        message: "Product updated",
      };
    }),
  listProduct: storeProtectedProcedure.query(async (opts) => {
    const { db, storeDetails } = opts.ctx;

    const productData = await db
      .select()
      .from(product)
      .where(eq(product.storeId, storeDetails.id));

    return productData;
  }),
  listAllProduct: protectedProcedure.query(async (op) => {
    const { db } = op.ctx;
    const p = await db.select().from(product);
    return p;
  }),
  getProductByCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.number(),
        limit: z.number().optional(),
      })
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { categoryId, limit } = opts.input;
      const productList = db
        .select()
        .from(productAvailable)
        .where(eq(productAvailable.categoryId, categoryId));
      return limit ? await productList.limit(limit) : await productList;
    }),
  getProductByAvailable: protectedProcedure
    .input(
      z.object({
        lat: z.number(),
        long: z.number(),
        availableId: z.number(),
        limit: z.number().optional(),
      })
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { availableId, limit } = opts.input;
      const productList = db
        .select({
          product,
        })
        .from(product)
        .where(eq(product.productAvailable, availableId))
        .innerJoin(store, eq(product.storeId, store.id))
        .orderBy(
          asc(distanceSort(store.location, opts.input.long, opts.input.lat))
        );
      return limit ? await productList.limit(limit) : await productList;
    }),

  deleteProduct: storeProtectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { db, storeDetails } = opts.ctx;
      const { id } = opts.input;

      await db
        .delete(product)
        .where(and(eq(product.id, id), eq(product.storeId, storeDetails.id)));
      return {
        message: "Product deleted",
      };
    }),

  getProductBySearch: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { query } = opts.input;
      const productList = await db
        .select()
        .from(productAvailable)
        .where(and(like(productAvailable.name, `%${query}%`)));
      return productList;
    }),
});
