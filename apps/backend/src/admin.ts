import { category, eq, productAvailable } from "@pkg/lib";
import { publicProcedure, router } from "./util/trpc";
import { CategorySchema, ProductAvailSchema } from "./export";
import { z } from "zod";

export const admin = router({
  getCateogryById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { id } = opts.input;
      const categories = await db
        .select()
        .from(category)
        .where(eq(category.id, id));
      return categories[0];
    }),
  getProductAvailableById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async (opts) => {
      const { db } = opts.ctx;
      const { id } = opts.input;
      const products = await db
        .select()
        .from(productAvailable)
        .where(eq(productAvailable.id, id));
      return products[0];
    }),
  createCategory: publicProcedure
    .input(CategorySchema)
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { name, description, img } = opts.input;
      const newCategory = await db
        .insert(category)
        .values({
          name,
          description,
          img: img.uploadedFiles[0],
        })
        .returning({
          id: category.id,
        });
      return {
        id: newCategory[0].id,
      };
    }),
  modifyCategory: publicProcedure
    .input(CategorySchema)
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { name, description, img, id } = opts.input;
      if (id === undefined) {
        throw new Error("id is required");
      }
      await db
        .update(category)
        .set({
          name,
          description,
          img: img.uploadedFiles[0],
        })
        .where(eq(category.id, id));

      return {
        message: "Category updated",
      };
    }),
  deleteCategory: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { id } = opts.input;
      await db.delete(category).where(eq(category.id, id));
      return {
        message: "Category deleted",
      };
    }),
  listCategory: publicProcedure.query(async (opts) => {
    const { db } = opts.ctx;
    const categories = await db.select().from(category);

    return categories;
  }),
  listProductAvailable: publicProcedure.query(async (opts) => {
    const { db } = opts.ctx;
    const products = await db.select().from(productAvailable);

    return products;
  }),
  createProductAvailable: publicProcedure
    .input(ProductAvailSchema)
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { name, description, img, category } = opts.input;
      const newProduct = await db
        .insert(productAvailable)
        .values({
          name,
          description,
          img: img.uploadedFiles[0],
          categoryId: category,
        })
        .returning({
          id: productAvailable.id,
        });
      return {
        id: newProduct[0].id,
      };
    }),
  modifyProductAvailable: publicProcedure
    .input(ProductAvailSchema)
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { name, description, img, category, id } = opts.input;
      if (id === undefined) {
        throw new Error("id is required");
      }
      await db
        .update(productAvailable)
        .set({
          name,
          description,
          img: img.uploadedFiles[0],
          categoryId: category,
        })
        .where(eq(productAvailable.id, id));

      return {
        message: "Product updated",
      };
    }),
  deleteProductAvailable: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { db } = opts.ctx;
      const { id } = opts.input;
      await db.delete(productAvailable).where(eq(productAvailable.id, id));
      return {
        message: "Product deleted",
      };
    }),
});
