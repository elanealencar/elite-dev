import type { Request, Response } from "express";
import {
  createEventService,
  getEventByIdService,
  getEventSeatsService,
  listEventsService,
  listOrganizerEventsService,
  publishEventService,
} from "./event.service.js";
import { z } from "zod";

const createEventSchema = z.object({
  tmdbMovieId: z.number().int().positive(),
  dateTime: z.string().datetime(),
  location: z.string().min(1),
  room: z.string().min(1),
  price: z.number().positive(),
});

export async function createEvent(
  request: Request,
  response: Response
) {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: "Não autorizado",
      });
    }

    const parsed = createEventSchema.safeParse(request.body);

    if (!parsed.success) {
      return response.status(400).json({
        message: "Dados do evento inválidos",
      });
    }

    const event = await createEventService({
      ...parsed.data,
      organizerId: request.user.id,
    });

    return response.status(201).json(event);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "MOVIE_NOT_FOUND"
    ) {
      return response.status(404).json({
        message: " Filme não encontrado",
      });
    }

    if (
      error instanceof Error &&
      error.message === "TMDB_REQUEST_FAILED"
    ) {
      return response.status(502).json({
        message: "Não foi possível consultar o filme na TMDb",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function listEvents(
  _request: Request,
  response: Response
) {
  try {
    const events = await listEventsService();

    return response.status(200).json(events);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function getEventById(
  request: Request,
  response: Response
) {
  try {
    const id = request.params.id;

    if (typeof id !== "string") {
      return response.status(400).json({
        message: "ID do evento inválido",
      });
    }

    const event = await getEventByIdService(id);

    if (!event) {
      return response.status(404).json({
        message: "Evento não encontrado",
      });
    }

    return response.status(200).json(event);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function getEventSeats(
  request: Request,
  response: Response
) {
  try {
    const id = request.params.id;

    if (typeof id !== "string") {
      return response.status(400).json({
        message: "ID do evento inválido",
      });
    }

    const event = await getEventByIdService(id);

    if (!event) {
      return response.status(404).json({
        message: "Evento não encontrado",
      });
    }

    const seats = await getEventSeatsService(id);

    return response.status(200).json(seats);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function publishEvent(
  request: Request,
  response: Response
) {
  try {
    const id = request.params.id;

    if (typeof id !== "string") {
      return response.status(400).json({
        message: "ID do evento inválido",
      });
    }

    if (!request.user) {
      return response.status(401).json({
        message: "Não autorizado",
      });
    }

    const event = await publishEventService(
      id,
      request.user.id
    );

    return response.status(200).json(event);
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
      error.message === "FORBIDDEN"
    ) {
      return response.status(403).json({
        message: "Você não tem permissão para realizar esta ação",
      });
    }

    if (
      error instanceof Error &&
      error.message === "EVENT_CANCELLED"
    ) {
      return response.status(409).json({
        message: "Um evento cancelado não pode ser publicado",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}

export async function listOrganizerEvents(
  request: Request,
  response: Response
) {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: "Não autorizado",
      });
    }

    const events = await listOrganizerEventsService(
      request.user.id
    );

    return response.status(200).json(events);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}