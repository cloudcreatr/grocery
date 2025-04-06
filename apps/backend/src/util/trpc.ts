import { initTRPC, TRPCError } from "@trpc/server";

import { subjects } from "@pkg/lib";
import { client } from "./client";
import { db } from "@pkg/lib";
type HonoContext = {
  header: Headers;
};

const t = initTRPC.context<HonoContext>().create();

export const publicProcedure = t.procedure.use((o) => {
  return o.next({
    ctx: {
      db,
    },
  });
});
export const protectedProcedure = publicProcedure.use(async (opt) => {
  const { header } = opt.ctx;
  const authorization = header.get("authorization");
  if (!authorization) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorize, no authorization header",
    });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorize, no access_token",
    });
  }
  const accessToken = token;

  const claims = await client.verify(subjects, accessToken);
  if (claims.err) {
    console.error(claims.err);
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorize, invaild acccess_token",
    });
  }
  return opt.next({
    ctx: {
      user: claims.subject.properties,
    },
  });
});
export const router = t.router;
