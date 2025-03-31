import { eq, user } from "@pkg/lib";
import { protectedProcedure, router } from "./util/trpc";
import { z } from "zod";

const userInputSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
  doc: z.string().array().optional(),
});

export const userDetails = router({
  getUser: protectedProcedure.query(async (opts) => {
    const { db, user: U } = opts.ctx;
    const userD = await db.select().from(user).where(eq(user.id, U.id));

    return userD[0];
  }),
  editUser: protectedProcedure.input(userInputSchema).mutation(async (opts) => {
    const { db, user: U } = opts.ctx;
    const { name, email, phone, address, lat, long, doc } = opts.input;
    await db
      .update(user)
      .set({
        name,
        email,
        phone,
        address,
        lat,
        long,
        doc: doc
          ? {
              id: doc,
            }
          : null,
      })
      .where(eq(user.id, U.id));
    return "User updated";
  }),
});
