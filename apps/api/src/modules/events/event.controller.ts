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
        message: "Invalid event data",
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
        message: "Movie not found",
      });
    }

    if (
      error instanceof Error &&
      error.message === "TMDB_REQUEST_FAILED"
    ) {
      return response.status(502).json({
        message: "Failed to fetch movie from TMDb",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
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
      message: "Internal server error",
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
        message: "Invalid event id",
      });
    }

    const event = await getEventByIdService(id);

    if (!event) {
      return response.status(404).json({
        message: "Event not found",
      });
    }

    return response.status(200).json(event);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
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
        message: "Invalid event id",
      });
    }

    const event = await getEventByIdService(id);

    if (!event) {
      return response.status(404).json({
        message: "Event not found",
      });
    }

    const seats = await getEventSeatsService(id);

    return response.status(200).json(seats);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
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
        message: "Invalid event id",
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
        message: "Event not found",
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
      error.message === "EVENT_CANCELLED"
    ) {
      return response.status(409).json({
        message: "Cancelled event cannot be published",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
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
      message: "Internal server error",
    });
  }
}