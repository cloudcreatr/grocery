import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'
import { createBunWSHandler } from "trpc-bun-adapter";
import {
  
  publicProcedure,
  router,
  wsProcedure,
} from "./util/trpc";
import { logger } from "hono/logger";
import { userDetails } from "./user";
import { maps } from "./map";
import { upload } from "./upload";
import { bankDetails } from "./bank";
import { storeroute } from "./store";
import { pubsub } from "./util/pubsub";


setInterval(() => {
  pubsub.publish("random", {
    message: "Hello from backend",
    time: new Date().toISOString(),
  } as Message);
}, 1000);
import { z } from "zod";
import { productRoute } from "./product";
import { order } from "./order";
export const appRouter = router({
  user: userDetails,
  maps: maps,
  bank: bankDetails,
  store: storeroute,
  product: productRoute,
  order,
  random: wsProcedure.subscription(async function* (opt) {
    for await (const data of pubsub.subscribe("random")) {
      yield data as [unknown] as [Message]; // Yield the data to the subscriber
    }
  }),
  test: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query((o) => {
      const { name } = o.input;
      return {
        input: name,
        message: Math.random().toString(),
      };
    }),
});
type Message = {
  message: string;
  time: string;
};

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
