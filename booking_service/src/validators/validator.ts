import {z} from "zod";

export const createBookingValidatorSchema = z.object({
     userId:z.number().int().positive("User id must be a positive integer"),
     hotelId:z.number().int().positive("Hotel id must be a positive integer"),
     totalGuests:z.number().int().positive("Total guests must be a positive integer"),
     bookingAmount:z.number().positive("Booking amount must be a positive number")
})

export const finalizeBookingValidatorSchema = z.object({
     idemPotencyKey:z.string().trim().min(1, "Idempotency key must be a non-empty string")
})

