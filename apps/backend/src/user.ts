import { eq, sql, user } from "@pkg/lib";
import { protectedProcedure, router } from "./util/trpc";

import { storeUserSchema } from "./export";
import { deleteFile } from "./upload";

export const userDetails = router({
  getUser: protectedProcedure.query(async (opts) => {
    const { db, user: U } = opts.ctx;
    const userD = await db
      .select({
        location: {
          lat: sql<number>`ST_Y(${user.location})`,
          long: sql<number>`ST_X(${user.location})`,
        },
      })
      .from(user)
      .where(eq(user.id, U.id));
    console.log(userD);
    return userD[0];
  }),
  editUser: protectedProcedure.input(storeUserSchema).mutation(async (opts) => {
    const { db, user: U } = opts.ctx;
    const { name, phone, address, gps, doc } = opts.input;

    await db
      .update(user)
      .set({
        name,

        phone,
        address,
        location: {
          x: gps.longitude,
          y: gps.latitude,
        },

        doc: doc
          ? {
              id: doc.uploadedFiles,
            }
          : null,
      })
      .where(eq(user.id, U.id));
    if (doc.deletedFiles.length > 0) {
      for (const file of doc.deletedFiles) {
        await deleteFile(file);
      }
    }
    return "User updated";
  }),
});
