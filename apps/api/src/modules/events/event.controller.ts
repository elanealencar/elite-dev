import type { Request, Response } from "express";
import {
  createEventService,
  getEventByIdService,
  getEventSeatsService,
  listEventsService,
} from "./event.service.js";

export async function createEvent(
  request: Request,
  response: Response
) {
  try {
    if (!request.user) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    const event = await createEventService({
      ...request.body,
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