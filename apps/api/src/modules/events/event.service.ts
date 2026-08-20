import { prisma } from "../../database/prisma.js";
import { getMovieByIdService } from "../catalog/catalog.service.js";

type CreateEventInput = {
  tmdbMovieId: number;
  dateTime: string;
  location: string;
  room: string;
  price: number;
  organizerId: string;
};

export async function createEventService(data: CreateEventInput) {
  const movie = await getMovieByIdService(data.tmdbMovieId);
  const rows = ["A", "B", "C", "D", "E", "F"];

  const seats = rows.flatMap((row) =>
    Array.from({ length: 8 }, (_, index) => ({
      row,
      number: index + 1,
    }))
  );

  return prisma.event.create({
    data: {
      tmdbMovieId: movie.id,
      movieTitle: movie.title,
      moviePosterUrl: movie.posterUrl,
      dateTime: new Date(data.dateTime),
      location: data.location,
      room: data.room,
      price: data.price,
      organizerId: data.organizerId,

      seats: {
        create: seats,
      },
    },

    include: {
      seats: true,
    },
  });
}

export async function listEventsService() {
  return prisma.event.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      dateTime: "asc",
    },
  });
}

export async function getEventByIdService(id: string) {
  return prisma.event.findUnique({
    where: {
      id,
    },
  });
}

export async function getEventSeatsService(eventId: string) {
  return prisma.eventSeat.findMany({
    where: {
      eventId,
    },
    orderBy: [
      {
        row: "asc",
      },
      {
        number: "asc",
      },
    ],
  });
}

export async function publishEventService(
  eventId: string,
  organizerId: string
) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  if (event.organizerId !== organizerId) {
    throw new Error("FORBIDDEN");
  }

  if (event.status === "CANCELLED") {
    throw new Error("EVENT_CANCELLED");
  }

  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      status: "PUBLISHED",
    },
  });
}

export async function listOrganizerEventsService(
  organizerId: string
) {
  return prisma.event.findMany({
    where: {
      organizerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}