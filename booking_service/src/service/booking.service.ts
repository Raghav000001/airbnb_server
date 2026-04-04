import type { CreateBookingDto } from "../dto/index.ts";
import { badRequest, NotFoundError } from "../errors/app.errors.ts";
import { generateIdempotencyKey } from "../helpers/generateIdempotencyKey.ts";
import {
  confirmBooking,
  createBooking,
  createIdemPotencyKey,
  finalizeIdemPotencyKey,
  getIdemPotencyKeyWithLock,
} from "../repositories/booking.repository.ts";
import PrismaClient from "../prisma/client.ts";

export async function createBookingService(bookingInput: CreateBookingDto) {
  const booking = await createBooking(bookingInput);
  const key = await generateIdempotencyKey();
  const idemPotencyKey = await createIdemPotencyKey(key, booking.id);
  return {
    bookingId: booking.id,
    idemPotencyKey,
  };
}

export async function finalizeBookingService(idemPotencyKey: string) {
  return await PrismaClient.$transaction(async (txn) => {
    const idemPotencyKeyData = await getIdemPotencyKeyWithLock(txn,idemPotencyKey);
    if (!idemPotencyKeyData) {
      throw new NotFoundError("Idempotency key not found");
    }
    if (idemPotencyKeyData.finalized) {
      throw new badRequest("Booking already finalized");
    }
    const booking = await confirmBooking(txn,idemPotencyKeyData.bookingId);
    await finalizeIdemPotencyKey(txn,idemPotencyKey);
    return booking;
  });
}
