import redis from "redis";

export const subRedisClient = redis.createClient({
  url: process.env.REDIS_SUBSCRIPTIONS_INSTANCE_URL,
});
