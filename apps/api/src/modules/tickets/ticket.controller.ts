import type { Request, Response } from "express";
import { listCustomerTicketsService, generateTicketQrCodeService, getSharedTicketService } from "./ticket.service.js";

export async function listCustomerTickets(
  request: Request,
  response: Response
) {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    const tickets =
      await listCustomerTicketsService(request.user.id);

    return response.status(200).json(tickets);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getTicketQrCode(
  request: Request,
  response: Response
) {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    const ticketId = request.params.id;

    if (typeof ticketId !== "string") {
      return response.status(400).json({
        message: "Invalid ticket id",
      });
    }

    const qr = await generateTicketQrCodeService(
      ticketId,
      request.user.id
    );

    return response.status(200).json(qr);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "TICKET_NOT_FOUND"
    ) {
      return response.status(404).json({
        message: "Ticket not found",
      });
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return response.status(403).json({
        message: "Forbidden",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getSharedTicket(
  request: Request,
  response: Response
) {
  try {
    const token = request.params.token;

    if (typeof token !== "string") {
      return response.status(400).json({
        message: "Invalid share token",
      });
    }

    const ticket = await getSharedTicketService(token);

    return response.status(200).json(ticket);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "TICKET_NOT_FOUND"
    ) {
      return response.status(404).json({
        message: "Ticket not found",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
    });
  }
}