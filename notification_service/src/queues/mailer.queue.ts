 import { Queue } from "bullmq";
 import redisConnection from "../config/redis.config.ts";

 export const MAILER_QUEUE = "mailer_queue";

  export const mailerQueue = new Queue(MAILER_QUEUE,{
      connection: redisConnection(),
  })