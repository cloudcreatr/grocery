import { initTRPC, TRPCError } from "@trpc/server";

import { store, subjects } from "@pkg/lib";
import { client } from "./client";
import { db, eq } from "@pkg/lib";
import { z } from "zod";
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

export const storeProtectedProcedure = protectedProcedure.use(async (opt) => {
  const { db, user } = opt.ctx;
  const getStoreDetails = await db
    .select()
    .from(store)
    .where(eq(store.userId, user.id));
  let storeDetailsData = null;
  if (getStoreDetails.length === 0) {
    const storeDetails = await db
      .insert(store)
      .values({
        userId: user.id,
      })
      .returning();
    storeDetailsData = storeDetails[0];
  } else {
    storeDetailsData = getStoreDetails[0];
  }
  return opt.next({
    ctx: {
      storeDetails: storeDetailsData,
    },
  });
});

export const wsProcedure = publicProcedure
  .input(
    z.object({
      id: z.number(),
      email: z.string(),
    })
  )
  .use(async (opt) => {
    const input = opt.input;
    return opt.next({
      ctx: input,
    });
  });

export const router = t.router;
