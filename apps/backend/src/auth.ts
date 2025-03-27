import { subjects } from "@pkg/lib";
import { client } from "./util/client";
import { router, publicProcedure } from "./util/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const tokens = z.object({
  accessToken: z.string(),
  refresh: z.string(),
});

export const refresh = router({
  refresh: publicProcedure.input(tokens).mutation(async (opt) => {
    const { accessToken, refresh } = opt.input;
    const token = await client.verify(subjects, accessToken, {
      refresh,
    });
    if (token.err) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid token" });
    }
    let newToken: z.infer<typeof tokens>;
    if (token.tokens) {
      newToken = {
        accessToken: token.tokens.access,
        refresh: token.tokens.refresh,
      };
    } else {
      newToken = {
        accessToken,
        refresh,
      };
    }
    return newToken;
  }),
});
