import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'

import { router } from "./util/trpc";
import { logger } from "hono/logger";
import { userDetails } from "./user";
import { maps } from "./map";
import { upload } from "./upload";
import { bankDetails } from "./bank";
import { storeroute } from "./store";

export const appRouter = router({
  user: userDetails,
  maps: maps,
  bank: bankDetails,
  store: storeroute,
});

const app = new Hono();
app.use(logger());
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

app.route("/upload", upload);
const server = Bun.serve({
  port: 3001,
  fetch: app.fetch,
  idleTimeout: 150,
});

console.log(`Server Backend starter ${server.url}`);
