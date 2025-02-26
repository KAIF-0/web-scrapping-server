import puppeteer from "puppeteer";
import { chatRedisClient } from "../configs/redis/chatInstance.js";
import { subRedisClient } from "../configs/redis/subscriptionInstance.js";

//function to scrape the documentation of the provided urll
export const scrapeDocumentation = async (key, url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 0 });

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
  //   console.log(docsData);
  //saving the scraped data in redis
  chatRedisClient.setEx(key, 30 * 24 * 60 * 60, JSON.stringify(docsData));
};
