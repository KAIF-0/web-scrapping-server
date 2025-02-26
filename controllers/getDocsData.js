import { chatRedisClient } from "../configs/redis/chatInstance.js";

export const docsData = async (key, url) => {
  let docsData = await chatRedisClient.get(key);
  if (!docsData) {
    await scrapeDocumentation(key, url);
    docsData = await chatRedisClient.get(key);
  }
  //   console.log(docsData);
  return docsData ? JSON.parse(docsData) : [];
};
