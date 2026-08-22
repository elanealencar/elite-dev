import type { EventSeat } from "@/types/seat";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getEventSeats(
  eventId: string
): Promise<EventSeat[]> {
  const response = await fetch(
    `${API_URL}/events/${eventId}/seats`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível carregar os assentos"
    );
  }

  return response.json();
}