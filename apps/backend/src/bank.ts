import { router, protectedProcedure } from "./util/trpc";
import { bank, eq } from "@pkg/lib";
import { IndianBankDetailsSchema } from "./schema/form/formInput";
export const bankDetails = router({
  getBankDetails: protectedProcedure.query(async (opt) => {
    const { db, user } = opt.ctx;
    const data = await db.select().from(bank).where(eq(bank.userid, user.id));
    if (data.length === 0) {
      const data2 = await db
        .insert(bank)
        .values({
          userid: user.id,
        })
        .returning();
      return data2[0].details;
    }
    return data[0].details;
  }),
  editBankDetails: protectedProcedure
    .input(IndianBankDetailsSchema)
    .mutation(async (opt) => {
      const { db, user } = opt.ctx;
      await db
        .update(bank)
        .set({
          details: opt.input,
        })
        .where(eq(bank.userid, user.id));

      return {
        message: "Bank details updated",
      };
    }),
});
