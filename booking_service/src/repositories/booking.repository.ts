import { BookingStatus, Prisma, type Booking } from "@prisma/client";
import PrismaClient from "../prisma/client.ts";
import { validate as validateKey } from "uuid";
import { badRequest } from "../errors/app.errors.ts";
import { NotFoundError } from "../errors/app.errors.ts";
import type { IdempotencyKey } from "@prisma/client";

// ye type prisma se aa rha hai  automatically
export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
  const booking = await PrismaClient.booking.create({
    data: bookingInput,
  });
  return booking;
}

export async function getBookingById(bookingID: number) {
  const booking = await PrismaClient.booking.findUnique({
    where: {
      id: bookingID,
    },
  });
  return booking;
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

export async function getIdemPotencyKeyWithLock(
  txn: Prisma.TransactionClient,
  key: string,
) {
  if (!validateKey(key)) {
    throw new badRequest("Invalid idempotency key");
  }

  const idempotencyKey: Array<IdempotencyKey> = await txn.$queryRaw(
    Prisma.sql`SELECT * FROM \`IdempotencyKey\` WHERE \`key\` = ${key} FOR UPDATE`,
  );

  if (!idempotencyKey || idempotencyKey.length === 0) {
    throw new NotFoundError("Idempotency key not found");
  }

  return idempotencyKey[0];
}

export async function finalizeIdemPotencyKey(
  txn: Prisma.TransactionClient,
  key: string,
) {
  const idempotencyKey = await txn.idempotencyKey.update({
    where: {
      key,
    },
    data: {
      finalized: true,
    },
  });
  return idempotencyKey;
}

export async function confirmBooking(
  txn: Prisma.TransactionClient,
  bookingID: number,
) {
  const booking = await txn.booking.update({
    where: {
      id: bookingID,
    },
    data: {
      bookingStatus: BookingStatus.CONFIRMED,
    },
  });
  return booking;
}

export async function cancelBooking(bookingID: number) {
  const booking = await PrismaClient.booking.update({
    where: {
      id: bookingID,
    },
    data: {
      bookingStatus: BookingStatus.CANCELLED,
    },
  });
  return booking;
}
