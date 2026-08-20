import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma.js";

type CreateReservationInput = {
  eventId: string;
  seatIds: string[];
  customerId: string;
};

export async function createReservationService(
  data: CreateReservationInput
) {
  const now = new Date();

  const expiresAt = new Date(
    now.getTime() + 10 * 60 * 1000
  );

  return prisma.$transaction(
    async (tx) => {
      const event = await tx.event.findUnique({
        where: {
          id: data.eventId,
        },
      });

      if (!event) {
        throw new Error("EVENT_NOT_FOUND");
      }

      if (event.status !== "PUBLISHED") {
        throw new Error("EVENT_NOT_AVAILABLE");
      }

      if (event.dateTime <= now) {
        throw new Error("EVENT_ALREADY_STARTED");
      }

      const seats = await tx.eventSeat.findMany({
        where: {
          eventId: data.eventId,
          id: {
            in: data.seatIds,
          },
        },
      });

      if (seats.length !== data.seatIds.length) {
        throw new Error("INVALID_SEATS");
      }

      const updatedSeats = await tx.eventSeat.updateMany({
        where: {
          eventId: data.eventId,

          id: {
            in: data.seatIds,
          },

          status: "AVAILABLE",
        },

        data: {
          status: "HELD",
          heldUntil: expiresAt,
        },
      });

      if (updatedSeats.count !== data.seatIds.length) {
        throw new Error("SEATS_UNAVAILABLE");
      }

      const totalAmount = event.price.mul(
        data.seatIds.length
      );

      const reservation = await tx.reservation.create({
        data: {
          customerId: data.customerId,
          eventId: data.eventId,
          expiresAt,
          totalAmount,

          seats: {
            create: data.seatIds.map((eventSeatId) => ({
              eventSeatId,
              price: event.price,
            })),
          },
        },

        include: {
          seats: {
            include: {
              eventSeat: true,
            },
          },
        },
      });

      return reservation;
    },
    {
      isolationLevel:
        Prisma.TransactionIsolationLevel.Serializable,
    }
  );
}