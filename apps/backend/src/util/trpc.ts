import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { subjects } from "@pkg/lib";
import { client } from "./client";


const tokens = z.object({
  accessToken: z.string(),
});


const t = initTRPC.create();

export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure
  .input(tokens)
  .use(async (opt) => {
    const { accessToken } = opt.input;
    const claims = await client.verify(subjects, accessToken);
    if (claims.err) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorize, invaild acccess_token",
      });
    }
    return opt.next({
      ctx: {
        user: claims.subject.properties,
        token: claims.tokens,
      },
    });
  });
export const router = t.router;
