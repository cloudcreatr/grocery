import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'
import { createBunWSHandler } from "trpc-bun-adapter";
import { router } from "./util/trpc";
import { logger } from "hono/logger";
import { userDetails } from "./user";
import { maps } from "./map";
import { upload } from "./upload";
import { bankDetails } from "./bank";
import { storeroute } from "./store";

import { productRoute } from "./product";
import { order } from "./order";
import { admin } from "./admin";
export const appRouter = router({
  user: userDetails,
  maps: maps,
  bank: bankDetails,
  store: storeroute,
  product: productRoute,
  order,
  admin,
});

const wsRouterHandler = createBunWSHandler({
  router: appRouter,
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
  fetch: (request, server) => {
    if (server.upgrade(request, { data: { req: request } })) {
      return;
    }

    console.log("fetching");
    return app.fetch(request);
  },
  idleTimeout: 150,
  websocket: wsRouterHandler,
});

console.log(`Server Backend starter ${server.url}`);
