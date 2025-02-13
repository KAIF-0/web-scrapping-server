import { prisma } from "../configs/prisma.js";
import { subRedisClient } from "../configs/redis/subscriptionInstance.js";

const getOrSetSubscriptionDetails = async (key) => {
  return new Promise(async (resolve, reject) => {
    const cacheData = await subRedisClient.get(key);
    if (cacheData) return resolve(JSON.parse(cacheData));

    //if not found in cache
    const freshData = await prisma.subscription.findUnique({
      where: { userId: key },
    });
    if (!freshData) return resolve(null);
    // console.log("freshData: ", freshData);
    //set expiry time
    const expiryTime =
      freshData.subscriptionType === "monthly"
        ? 30 * 24 * 60 * 60
        : 365 * 24 * 60 * 60;
    subRedisClient.setEx(key, expiryTime, JSON.stringify(freshData));
    return resolve(freshData);
  });
};

export default getOrSetSubscriptionDetails;
