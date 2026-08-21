import { randomBytes, randomUUID } from "node:crypto";
import { prisma } from "../../database/prisma.js";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";

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

export function generateTicketQrToken(
  ticketId: string,
  eventId: string
) {
  return jwt.sign(
    {
      ticketId,
      eventId,
      type: "ticket",
    },
    process.env.QR_SECRET!
  );
}

export async function generateTicketQrCodeService(
  ticketId: string,
  customerId: string
) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },

    include: {
      reservation: {
        include: {
          event: true,
        },
      },
    },
  });

  if (!ticket) {
    throw new Error("TICKET_NOT_FOUND");
  }

  if (ticket.reservation.customerId !== customerId) {
    throw new Error("FORBIDDEN");
  }

  const qrToken = generateTicketQrToken(
    ticket.id,
    ticket.reservation.eventId
  );

  const qrCode = await QRCode.toDataURL(qrToken);

  return {
    ticketId: ticket.id,
    code: ticket.code,
    qrToken,
    qrCode,
  };
}

export async function getSharedTicketService(
  shareToken: string
) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      shareToken,
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
  });

  if (!ticket) {
    throw new Error("TICKET_NOT_FOUND");
  }

  return {
    id: ticket.id,
    code: ticket.code,
    status: ticket.status,

    event: {
      title: ticket.reservation.event.movieTitle,
      posterUrl: ticket.reservation.event.moviePosterUrl,
      dateTime: ticket.reservation.event.dateTime,
      location: ticket.reservation.event.location,
      room: ticket.reservation.event.room,
    },

    seat: {
      row: ticket.reservationSeat.eventSeat.row,
      number: ticket.reservationSeat.eventSeat.number,
    },
  };
}