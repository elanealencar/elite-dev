import { prisma } from "../../database/prisma.js";

type CreateEventInput = {
  tmdbMovieId: number;
  movieTitle: string;
  moviePosterUrl?: string;
  dateTime: string;
  location: string;
  room: string;
  price: number;
  organizerId: string;
};

export async function createEventService(data: CreateEventInput) {
  const rows = ["A", "B", "C", "D", "E", "F"];

  const seats = rows.flatMap((row) =>
    Array.from({ length: 8 }, (_, index) => ({
      row,
      number: index + 1,
    }))
  );

  return prisma.event.create({
    data: {
      tmdbMovieId: data.tmdbMovieId,
      movieTitle: data.movieTitle,
      moviePosterUrl: data.moviePosterUrl,
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