import type { Request, Response } from "express";
import { processPaymentService } from "./payment.service.js";

export async function processPayment(
  request: Request,
  response: Response
) {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: "Não autorizado",
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
          "O resultado do pagamento deve ser APPROVED ou DECLINED",
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
        message: "Reserva não encontrada",
      });
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return response.status(403).json({
        message: "Você não tem permissão para realizar esta ação",
      });
    }

    if (
      error instanceof Error &&
      error.message === "RESERVATION_EXPIRED"
    ) {
      return response.status(409).json({
        message: "A reserva expirou",
      });
    }

    if (
      error instanceof Error &&
      error.message === "PAYMENT_ALREADY_PROCESSED"
    ) {
      return response.status(409).json({
        message: "O pagamento desta reserva já foi processado",
      });
    }

    if (
      error instanceof Error &&
      error.message === "RESERVATION_NOT_PAYABLE"
    ) {
      return response.status(409).json({
        message: "Esta reserva não pode ser paga",
      });
    }

    if (
      error instanceof Error &&
      error.message === "SEATS_NOT_HELD"
    ) {
      return response.status(409).json({
        message: "Os assentos desta reserva não estão mais reservados",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}