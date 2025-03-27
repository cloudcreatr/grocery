import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'

import { cors } from "hono/cors";
import { publicProcedure, router } from "./util/trpc";
import { refresh } from "./auth";
import { TRPCError } from "@trpc/server";

const appRouter = router({
  auth: refresh,
  test: publicProcedure.query(() => {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not allowed to access this resource",
    });
  }),
});

export type AppRouter = typeof appRouter;

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://127.0.0.1:8081/"],
  })
);
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
