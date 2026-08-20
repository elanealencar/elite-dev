import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma.js";

type PaymentResult = "APPROVED" | "DECLINED";

type ProcessPaymentInput = {
  reservationId: string;
  customerId: string;
  result: PaymentResult;
};

export async function processPaymentService(
  data: ProcessPaymentInput
) {
  const now = new Date();

  return prisma.$transaction(
    async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: {
          id: data.reservationId,
        },

        include: {
          seats: true,
          payment: true,
        },
      });

      if (!reservation) {
        throw new Error("RESERVATION_NOT_FOUND");
      }

      if (reservation.customerId !== data.customerId) {
        throw new Error("FORBIDDEN");
      }

      if (reservation.payment) {
        throw new Error("PAYMENT_ALREADY_PROCESSED");
      }

      if (reservation.status !== "PENDING_PAYMENT") {
        throw new Error("RESERVATION_NOT_PAYABLE");
      }

      const seatIds = reservation.seats.map(
        (seat) => seat.eventSeatId
      );

      if (reservation.expiresAt <= now) {
        await tx.reservation.update({
          where: {
            id: reservation.id,
          },

          data: {
            status: "EXPIRED",
          },
        });

        await tx.eventSeat.updateMany({
          where: {
            id: {
              in: seatIds,
            },
            status: "HELD",
          },

          data: {
            status: "AVAILABLE",
            heldUntil: null,
          },
        });

        throw new Error("RESERVATION_EXPIRED");
      }

      if (data.result === "DECLINED") {
        const payment = await tx.payment.create({
          data: {
            reservationId: reservation.id,
            amount: reservation.totalAmount,
            status: "DECLINED",
          },
        });

        await tx.reservation.update({
          where: {
            id: reservation.id,
          },

          data: {
            status: "PAYMENT_FAILED",
          },
        });

        await tx.eventSeat.updateMany({
          where: {
            id: {
              in: seatIds,
            },
            status: "HELD",
          },

          data: {
            status: "AVAILABLE",
            heldUntil: null,
          },
        });

        return {
          payment,
          reservationStatus: "PAYMENT_FAILED",
        };
      }

      const updatedSeats = await tx.eventSeat.updateMany({
        where: {
          id: {
            in: seatIds,
          },

          status: "HELD",

          heldUntil: {
            gt: now,
          },
        },

        data: {
          status: "SOLD",
          heldUntil: null,
        },
      });

      if (updatedSeats.count !== seatIds.length) {
        throw new Error("SEATS_NOT_HELD");
      }

      const payment = await tx.payment.create({
        data: {
          reservationId: reservation.id,
          amount: reservation.totalAmount,
          status: "APPROVED",
        },
      });

      await tx.reservation.update({
        where: {
          id: reservation.id,
        },

        data: {
          status: "PAID",
        },
      });

      return {
        payment,
        reservationStatus: "PAID",
      };
    },
    {
      isolationLevel:
        Prisma.TransactionIsolationLevel.Serializable,
    }
  );
}