import { genericErrorHandler } from "./middlewares/error.middleware.ts"
import { attachCorelationId } from "./middlewares/corelation.middleware.ts"
import express from "express"
import { setUpEmailWorker } from "./processors/email.processors.ts"
import { serverConfig } from "./config/index.ts"
import { addToQueue } from "./producers/mailer.producers.ts"
const app = express()


// add a correlationId to every request 
app.use(attachCorelationId)



// custom routes import
import v1Router from "./routes/v1/index.routes.ts"
import v2Router from "./routes/v2/index.router.ts"
import logger from "./config/logger.config.ts"
import type { NotificationDto } from "./dtos/index.ts"

// routes implementation
// api versioning
app.use("/api/v1",v1Router)
app.use("/api/v2",v2Router)



// custome error handler middleware to handle all the errors in the application
app.use(genericErrorHandler)



app.listen(serverConfig.PORT,()=> {
    console.log("app is running on port",serverConfig.PORT);
    setUpEmailWorker()
     logger.info("email worker is set up")

     const sampleNotification:NotificationDto = {
         to:'[EMAIL_ADDRESS]',
         subject:'Test Email',
         templateId:'test',
         params:{}
     }

     addToQueue(sampleNotification)
     
})