import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'

import { publicProcedure, router } from "./util/trpc";
import { refresh } from "./auth";
import { TRPCError } from "@trpc/server";

const appRouter = router({
  auth: refresh,
  test: publicProcedure.query(() => {
    console.log("test");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not allowed to access this resource",
    });
    return {
      message: "Hello, World!",
    };
  }),
});

export type AppRouter = typeof appRouter;

const app = new Hono();

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  })
);

const server = Bun.serve({
  port: 3001,
  fetch: app.fetch,
  idleTimeout: 5,
});

console.log(` Server Backend starter ${server.url}`);
