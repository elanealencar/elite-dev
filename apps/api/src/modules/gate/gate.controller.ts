import type { Request, Response } from "express";
import { validateTicketService } from "./gate.service.js";

export async function validateTicket(
  request: Request,
  response: Response
) {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    const { eventId, qrToken, code } = request.body;

    if (typeof eventId !== "string") {
      return response.status(400).json({
        message: "Event id is required",
      });
    }

    if (!qrToken && !code) {
      return response.status(400).json({
        message: "QR token or ticket code is required",
      });
    }

    if (qrToken && code) {
      return response.status(400).json({
        message: "Provide either QR token or ticket code",
      });
    }

    const result = await validateTicketService({
      eventId,
      gateUserId: request.user.id,
      qrToken:
        typeof qrToken === "string"
          ? qrToken
          : undefined,
      code:
        typeof code === "string"
          ? code
          : undefined,
    });

    return response.status(200).json(result);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
    });
  }
}