import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { config } from "dotenv";
import scrappingInstance from "./routes/srapping-route.js";
import chatInstance from "./routes/chat-routes.js";
import paymentInstance from "./routes/payment-routes.js";
import { subRedisClient } from "./configs/redis/subscriptionInstance.js";

config();
const app = new Hono();
const port = process.env.PORT;

// console.log(process.env.FRONTEND_URL, port);

app.use("*", logger());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//redis instance(subscriptionInstance)
await subRedisClient
  .connect()
  .then(() => {
    console.log("SUBSCRIPTIONS REDIS INSTANCE CONNECTED!");
  })
  .catch((err) => {
    console.log("REDIS ERROR: ", err);
  });

app.route("/", chatInstance);
app.route("/", scrappingInstance);
app.route("/subscription", paymentInstance);

// app.get('/', (c) => {
//   return c.text('Hello World!')
// })

//for error 500 (middleware)
app.onError((err, c) => {
  console.error(err.message);
  return c.json(
    {
      success: false,
      message: "Internal Server Error!",
    },
    500
  );
});

//for 404 (middleware)
app.notFound((c) => {
  console.error(c.get("message"));
  return c.json(
    {
      success: false,
      message: c.get("message"),
    },
    404
  );
});

serve(
  {
    fetch: app.fetch,
    port: port,
  },
  () => {
    console.log(`Server is running on port ${port}`);
  }
);
