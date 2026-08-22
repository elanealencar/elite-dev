export type Event = {
  id: string;
  tmdbMovieId: number;
  movieTitle: string;
  moviePosterUrl: string | null;
  dateTime: string;
  location: string;
  room: string;
  price: string;
  capacity: number;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  organizerId: string;
  createdAt: string;
  updatedAt: string;
};