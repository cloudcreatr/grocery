import { eq, product, and, category } from "@pkg/lib";
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
      const { name, description, price, category, img } = opts.input;

      const id = await db
        .insert(product)
        .values({
          storeId: storeDetails.id,
          name,
          description,
          price: parseFloat(price ?? "0"),
          categoryID: category,
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
  getProduct: storeProtectedProcedure
    .input(
      z.object({
        productId: z.number(),
      })
    )
    .query(async (opts) => {
      const { productId } = opts.input;
      const { db, storeDetails } = opts.ctx;

      const productData = await db
        .select()
        .from(product)
        .where(
          and(eq(product.id, productId), eq(product.storeId, storeDetails.id))
        );

      return productData[0];
    }),
  modifyProduct: storeProtectedProcedure
    .input(ProductModifySchema)
    .mutation(async (opts) => {
      const { id, name, description, price, category, img } = opts.input;
      const { db, storeDetails } = opts.ctx;

      await db
        .update(product)
        .set({
          name,
          description,
          price: parseFloat(price ?? "0"),
          categoryID: category,
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
  getCategory: protectedProcedure.query(async (op) => {
    const { db } = op.ctx;
    const p = await db.select().from(category);
    return p;
  }),
});
