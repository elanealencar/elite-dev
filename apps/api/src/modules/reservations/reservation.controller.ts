import type { Request, Response } from "express";
import { createReservationService } from "./reservation.service.js";

export async function createReservation(
  request: Request,
  response: Response
) {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: "Não autorizado",
      });
    }

    const { eventId, seatIds } = request.body;

    if (
      typeof eventId !== "string" ||
      !Array.isArray(seatIds) ||
      seatIds.length === 0 ||
      !seatIds.every((seatId) => typeof seatId === "string")
    ) {
      return response.status(400).json({
        message: "Dados da reserva inválidos",
      });
    }

    const uniqueSeatIds = [...new Set(seatIds)];

    if (uniqueSeatIds.length !== seatIds.length) {
      return response.status(400).json({
        message: "Não é permitido selecionar assentos duplicados",
      });
    }

    const reservation = await createReservationService({
      eventId,
      seatIds: uniqueSeatIds,
      customerId: request.user.id,
    });

    return response.status(201).json(reservation);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EVENT_NOT_FOUND"
    ) {
      return response.status(404).json({
        message: "Evento não encontrado",
      });
    }

    if (
      error instanceof Error &&
      error.message === "EVENT_NOT_AVAILABLE"
    ) {
      return response.status(409).json({
        message: "Este evento não está disponível para reservas",
      });
    }

    if (
      error instanceof Error &&
      error.message === "EVENT_ALREADY_STARTED"
    ) {
      return response.status(409).json({
        message: "Este evento já começou",
      });
    }

    if (
      error instanceof Error &&
      error.message === "INVALID_SEATS"
    ) {
      return response.status(400).json({
        message: "Um ou mais assentos não pertencem a este evento",
      });
    }

    if (
      error instanceof Error &&
      error.message === "SEATS_UNAVAILABLE"
    ) {
      return response.status(409).json({
        message: "Um ou mais assentos não estão mais disponíveis",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}