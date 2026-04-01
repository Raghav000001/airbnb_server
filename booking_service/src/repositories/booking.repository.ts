import { BookingStatus, Prisma, type Booking } from "@prisma/client";
import PrismaClient from "../prisma/client.ts";

// ye type prisma se aa rha hai  automatically
export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
  const booking = await PrismaClient.booking.create({
    data: bookingInput,
  });
  return booking;
}

export async function getBookingById(bookingID:number) {
     const booking = await PrismaClient.booking.findUnique({
        where:{
            id:bookingID
        }
     })
     return booking
}

export async function createIdemPotencyKey(key: string, bookingID: number) {
  const idempotencyKey = await PrismaClient.idempotencyKey.create({
    data: {
      key: key,
      booking: {
        connect: {
          id: bookingID,
        },
      },
    },
  });
  return idempotencyKey;
}

export async function getIdemPotencyKey(key:string) {
     const idempotencyKey = await PrismaClient.idempotencyKey.findUnique({
        where:{
            key
        }
     })
     return idempotencyKey
}

export async function finalizeIdemPotencyKey(key:string) {
     const idempotencyKey = await PrismaClient.idempotencyKey.update({
        where:{
            key
        },
        data:{
            finalized:true
        }
     })
     return idempotencyKey
}

export async function confirmBooking(bookingID:number) {
   const booking =  await PrismaClient.booking.update({
         where:{
            id:bookingID
         },
         data:{
            bookingStatus:BookingStatus.CONFIRMED
         }
     })
     return booking
}

export async function cancelBooking(bookingID:number) {
    const booking = await PrismaClient.booking.update({
        where:{
            id:bookingID
        },
        data:{
            bookingStatus:BookingStatus.CANCELLED
        }
    })
    return booking
}