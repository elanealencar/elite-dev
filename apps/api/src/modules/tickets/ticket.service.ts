import { randomBytes, randomUUID } from "node:crypto";
import { prisma } from "../../database/prisma.js";

export function generateTicketCode() {
  return `TKT-${randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;
}

export function generateShareToken() {
  return randomUUID();
}

export async function listCustomerTicketsService(
  customerId: string
) {
  return prisma.ticket.findMany({
    where: {
      reservation: {
        customerId,
      },
    },

    include: {
      reservationSeat: {
        include: {
          eventSeat: true,
        },
      },

      reservation: {
        include: {
          event: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}