import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'

import { protectedProcedure, publicProcedure, router } from "./util/trpc";
import { refresh } from "./auth";
import { TRPCError } from "@trpc/server";

const appRouter = router({
  auth: refresh,
  test: protectedProcedure.query((opt) => {
    const { user } = opt.ctx;
    console.log("user", user);
   
    return {
      user,
     
    };
  }),
});

export type AppRouter = typeof appRouter;

const app = new Hono();

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (c) => {
      return {
        header: c.req.headers,
      };
    },
  })
);

const server = Bun.serve({
  port: 3001,
  fetch: app.fetch,
  idleTimeout: 5,
});

console.log(` Server Backend starter ${server.url}`);
