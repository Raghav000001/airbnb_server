import { Router } from "express";
import { createBookingController, confirmBookingController } from "../../controllers/booking.controller.ts";
import { validate } from "../../middlewares/zod.middleware.ts";
import { createBookingValidatorSchema } from "../../validators/validator.ts";

const bookingRouter = Router();

bookingRouter.route('/create').post(validate(createBookingValidatorSchema),createBookingController)
bookingRouter.route('/confirm/:idemPotencyKey').post(confirmBookingController)

export default bookingRouter
