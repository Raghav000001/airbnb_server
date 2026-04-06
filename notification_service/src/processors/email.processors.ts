import { Worker } from "bullmq";
import redisConnection from "../config/redis.config.ts";
import { MAILER_QUEUE } from "../queues/mailer.queue.ts";
import logger from "../config/logger.config.ts";
import { MALIER_PAYLOAD } from "../producers/mailer.producers.ts";

export const setUpEmailWorker = ()=> {
     const emailProcessor = new Worker(
   MAILER_QUEUE,
   async (job) => {
      if (job.name !== MALIER_PAYLOAD) {
         throw new Error("Invalid job name")
      }
      logger.info("Processing email", job.data);

      // call a service here
   },
   {
      connection: redisConnection(),
   }
)

emailProcessor.on("completed",(job)=> {
   logger.info("Job is completed",job.id)
})

emailProcessor.on("failed",(job)=> {
   logger.info("Job is failed",job?.id)
})
}