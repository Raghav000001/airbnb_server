import { Prisma } from "@prisma/client";
import PrismaClient from "../prisma/client.ts"


// ye type prisma se aa rha hai  automatically
export async function createBooking(bookingInput:Prisma.BookingCreateInput) {
   const booking = await PrismaClient.booking.create({
        data:bookingInput
    })
    return booking
}
