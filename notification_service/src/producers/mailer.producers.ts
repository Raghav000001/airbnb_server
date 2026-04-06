import type { NotificationDto } from "../dtos/index.ts"
import { mailerQueue } from "../queues/mailer.queue.ts"
import logger from "../config/logger.config.ts"

export const MALIER_PAYLOAD = 'mailer_payload'

 const addToQueue = async (data:NotificationDto) => {
     await mailerQueue.add(MALIER_PAYLOAD,data)
     logger.info("Mail added to queue",data)
 }

 export { addToQueue }