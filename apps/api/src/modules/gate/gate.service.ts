import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma.js";

type ValidateTicketInput = {
  eventId: string;
  gateUserId: string;
  qrToken?: string;
  code?: string;
};

type QrPayload = {
  ticketId: string;
  eventId: string;
  type: string;
};

export async function validateTicketService(
  data: ValidateTicketInput
) {
  return prisma.$transaction(
    async (tx) => {
      let ticketId: string | undefined;

      if (data.qrToken) {
        try {
          const payload = jwt.verify(
            data.qrToken,
            process.env.QR_SECRET!
          ) as QrPayload;

          if (
            payload.type !== "ticket" ||
            !payload.ticketId ||
            !payload.eventId
          ) {
            throw new Error("INVALID_QR");
          }

          ticketId = payload.ticketId;

          if (payload.eventId !== data.eventId) {
            await tx.ticketValidation.create({
              data: {
                ticketId,
                eventId: data.eventId,
                gateUserId: data.gateUserId,
                result: "WRONG_EVENT",
              },
            });

            return {
              result: "WRONG_EVENT" as const,
            };
          }
        } catch {
          await tx.ticketValidation.create({
            data: {
              eventId: data.eventId,
              gateUserId: data.gateUserId,
              result: "INVALID",
            },
          });

          return {
            result: "INVALID" as const,
          };
        }
      }

      let ticket;

      if (ticketId) {
        ticket = await tx.ticket.findUnique({
          where: {
            id: ticketId,
          },

          include: {
            reservation: true,
          },
        });
      } else if (data.code) {
        ticket = await tx.ticket.findUnique({
          where: {
            code: data.code,
          },

          include: {
            reservation: true,
          },
        });
      }

      if (!ticket) {
        await tx.ticketValidation.create({
          data: {
            eventId: data.eventId,
            gateUserId: data.gateUserId,
            result: "INVALID",
          },
        });

        return {
          result: "INVALID" as const,
        };
      }

      if (ticket.reservation.eventId !== data.eventId) {
        await tx.ticketValidation.create({
          data: {
            ticketId: ticket.id,
            eventId: data.eventId,
            gateUserId: data.gateUserId,
            result: "WRONG_EVENT",
          },
        });

        return {
          result: "WRONG_EVENT" as const,
        };
      }

      if (ticket.status === "USED") {
        await tx.ticketValidation.create({
          data: {
            ticketId: ticket.id,
            eventId: data.eventId,
            gateUserId: data.gateUserId,
            result: "ALREADY_USED",
          },
        });

        return {
          result: "ALREADY_USED" as const,
          ticket,
        };
      }

      if (ticket.status !== "VALID") {
        await tx.ticketValidation.create({
          data: {
            ticketId: ticket.id,
            eventId: data.eventId,
            gateUserId: data.gateUserId,
            result: "INVALID",
          },
        });

        return {
          result: "INVALID" as const,
        };
      }

      const updated = await tx.ticket.updateMany({
        where: {
          id: ticket.id,
          status: "VALID",
        },
        data: {
          status: "USED",
          usedAt: new Date(),
        },
      });

      if (updated.count === 0) {
        await tx.ticketValidation.create({
          data: {
            ticketId: ticket.id,
            eventId: data.eventId,
            gateUserId: data.gateUserId,
            result: "ALREADY_USED",
          },
        });

        return {
          result: "ALREADY_USED" as const,
        };
      }

      await tx.ticketValidation.create({
        data: {
          ticketId: ticket.id,
          eventId: data.eventId,
          gateUserId: data.gateUserId,
          result: "VALID",
        },
      });

      return {
        result: "VALID" as const,
        ticket: {
          id: ticket.id,
          code: ticket.code,
        },
      };
    },
    {
      isolationLevel:
        Prisma.TransactionIsolationLevel.Serializable,
    }
  );
}