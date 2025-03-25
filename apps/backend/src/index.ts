import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'

import { cors } from "hono/cors";
const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

async function hello(input: string) {
  return `Hello ${input + "Worldfghfsdfsdfsdfsdfsdfsdfsdfsdffgh"}!`;
}

const appRouter = router({
  hello: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input }) => {
      const data = await hello(input ?? "World");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("data", data);
      return {
        message: data,
      };
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
