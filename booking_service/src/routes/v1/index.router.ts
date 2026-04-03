import { Router } from "express";
import bookingRouter from "./booking.router.ts";


const v1Router = Router();

v1Router.use("/booking",bookingRouter)

export default v1Router;
