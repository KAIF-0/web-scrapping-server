import { Hono } from "hono";

const chatInstance = new Hono();

chatInstance.get("/", (c) => {
  return c.text("Hello Chat!");
});

export default chatInstance;
