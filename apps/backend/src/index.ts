import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'

import { router } from "./util/trpc";
import { logger } from "hono/logger";
import { userDetails } from "./user";
import { maps } from "./map";
import { upload, uploadFile } from "./upload";

const appRouter = router({
  user: userDetails,
  maps: maps,
  file: uploadFile,
});

export type AppRouter = typeof appRouter;

const app = new Hono();
app.use(logger())
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

app.route("/upload", upload);

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
