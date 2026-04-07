import type { NotificationDto } from "../dto/index.ts"
import { mailerQueue } from "../queue/email.queue.ts"
import logger from "../config/logger.config.ts"

export const MALIER_PAYLOAD = 'mailer_payload'

 const addToQueue = async (data:NotificationDto) => {
     await mailerQueue.add(MALIER_PAYLOAD,data)
     logger.info("Mail added to queue",data)
 }

 export { addToQueue }