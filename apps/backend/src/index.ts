import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'

import {  router } from "./util/trpc";

import { userDetails } from "./user";

const appRouter = router({
  user: userDetails,
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

app.get("/", (c) => {
  return c.json({
    message: "from backend",
  });
});

const server = Bun.serve({
  port: 3001,
  fetch: app.fetch,
  idleTimeout: 150,
});

console.log(` Server Backend starter ${server.url}`);
