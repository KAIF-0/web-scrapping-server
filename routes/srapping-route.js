import { Hono } from "hono";
import { scrapeDocumentation } from "../controllers/scrapeDocumentation.js";
const scrappingInstance = new Hono();

scrappingInstance.get("/scrap", (c) => {
  scrapeDocumentation("https://nextjs.org/docs");
  return c.text("Hello Scrapper!");
});

export default scrappingInstance;
