import { eq, store } from "@pkg/lib";
import { storeInfoSchema } from "./export";
import { protectedProcedure, router, storeProtectedProcedure } from "./util/trpc";

export const storeroute = router({
  getStoreDetails: storeProtectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;
    const getStoreDetails = await db
      .select()
      .from(store)
      .where(eq(store.userId, user.id));

    
    return getStoreDetails[0];
  }),
  updateStoreDetails: protectedProcedure
    .input(storeInfoSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      await db
        .update(store)
        .set({
          name: input.name,
          description: input.description,
          img:
            input.img.uploadedFiles.length > 0
              ? input.img.uploadedFiles[0]
              : null,
          address: input.address,
          lat: input.gps?.latitude,
          long: input.gps?.longitude,
        })
        .where(eq(store.userId, user.id));

      return {
        message: "Store details updated successfully",
      };
    }),
});
