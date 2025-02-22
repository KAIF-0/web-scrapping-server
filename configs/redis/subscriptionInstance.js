import redis from "redis";
import { config } from "dotenv";

config();
export const subRedisClient = redis.createClient({
  url: process.env.REDIS_SUBSCRIPTIONS_INSTANCE_URL,
});
