import { Hono } from "hono";
import puppeteer from "puppeteer";
const scrappingInstance = new Hono();



const scrapeDocumentation = async (baseUrl) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(baseUrl, { waitUntil: "load", timeout: 0 });

 //get all the other pages links in the documentation for provided url
  const docLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a[href]"))
      .map((link) => link.href)
      .filter((href) => href.includes("/docs")); 
  });

  // console.log(docLinks)

  let docsData = [];

  for (let pageLink of docLinks) {
    await page.goto(pageLink, { waitUntil: "load", timeout: 0 });

    //scrap all the text from all the pages
    const content = await page.evaluate(() => {
      return document.body.innerText;
    });
    // console.log(content);

    docsData.push({ url: pageLink, content });
  }

  await browser.close();
  // console.log(docsData);
};

scrappingInstance.get("/scrap", (c) => {
  scrapeDocumentation("https://nextjs.org/docs");
  return c.text("Hello Scrapper!");
});

export default scrappingInstance;
