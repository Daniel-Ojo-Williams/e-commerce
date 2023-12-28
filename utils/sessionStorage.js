import RedisStore from "connect-redis";
import { createClient } from "redis";
import "dotenv/config";

// initialize redis client
const redisClient = createClient({
  port: 6379,
  host: "localhost",
});
redisClient.connect().catch(err => console.log(err));

// initialize store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'e-commerce-store:',
});

export default redisStore