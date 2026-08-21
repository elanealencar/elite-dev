import type { Request, Response } from "express";
import { listCustomerTicketsService } from "./ticket.service.js";

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