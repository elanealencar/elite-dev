import type { Request, Response } from "express";
import { processPaymentService } from "./payment.service.js";

export async function processPayment(
  request: Request,
  response: Response
) {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    const reservationId = request.params.id;
    const { result } = request.body;

    if (typeof reservationId !== "string") {
      return response.status(400).json({
        message: "Invalid reservation id",
      });
    }

    if (
      result !== "APPROVED" &&
      result !== "DECLINED"
    ) {
      return response.status(400).json({
        message:
          "Payment result must be APPROVED or DECLINED",
      });
    }

    const payment = await processPaymentService({
      reservationId,
      customerId: request.user.id,
      result,
    });

    return response.status(200).json(payment);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "RESERVATION_NOT_FOUND"
    ) {
      return response.status(404).json({
        message: "Reservation not found",
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

    if (
      error instanceof Error &&
      error.message === "RESERVATION_EXPIRED"
    ) {
      return response.status(409).json({
        message: "Reservation has expired",
      });
    }

    if (
      error instanceof Error &&
      error.message === "PAYMENT_ALREADY_PROCESSED"
    ) {
      return response.status(409).json({
        message: "Payment has already been processed",
      });
    }

    if (
      error instanceof Error &&
      error.message === "RESERVATION_NOT_PAYABLE"
    ) {
      return response.status(409).json({
        message: "Reservation cannot be paid",
      });
    }

    if (
      error instanceof Error &&
      error.message === "SEATS_NOT_HELD"
    ) {
      return response.status(409).json({
        message: "Reservation seats are no longer held",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
    });
  }
}