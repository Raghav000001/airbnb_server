import { genericErrorHandler } from "./middlewares/error.middleware.ts"
import { attachCorelationId } from "./middlewares/corelation.middleware.ts"
import express from "express"
import { serverConfig } from "./config/index.ts"
const app = express()
app.use(express.json());


// add a correlationId to every request 
app.use(attachCorelationId)



// custom routes import
import v1Router from "./routes/v1/index.router.ts"
import v2Router from "./routes/v2/index.router.ts"
import { addToQueue } from "./producers/email.pruducers.ts"

// routes implementation
// api versioning
app.use("/api/v1",v1Router)
app.use("/api/v2",v2Router)



// custome error handler middleware to handle all the errors in the application
app.use(genericErrorHandler)



app.listen(serverConfig.PORT,()=> {
    console.log("app is running on port",serverConfig.PORT);
    addToQueue({
        to:"[EMAIL_ADDRESS]",
        subject:"Booking Confirmation",
        templateId:"booking_confirmation",
        params:{
            userName:"Raghav",
            bookingId:"123456789",
            bookingDate:"2022-01-01",
            bookingAmount:1000,
            hotelName:"Hotel Name",
            hotelId:1,
            totalGuests:2,
        }
    })
})