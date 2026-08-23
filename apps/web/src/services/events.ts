import type { Event } from "@/types/event";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/events`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar os eventos");
  }

  return response.json();
}

export async function getEventById(
  id: string
): Promise<Event | null> {
  const response = await fetch(`${API_URL}/events/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Não foi possível carregar o evento");
  }

  return response.json();
}

export async function getOrganizerEvents(
  token: string
): Promise<Event[]> {
  const response = await fetch(
    `${API_URL}/events/organizer/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Não foi possível carregar seus eventos"
    );
  }

  return data;
}

export async function publishEvent(
  eventId: string,
  token: string
): Promise<Event> {
  const response = await fetch(
    `${API_URL}/events/${eventId}/publish`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Não foi possível publicar o evento"
    );
  }

  return data;
}

type CreateEventInput = {
  tmdbMovieId: number;
  dateTime: string;
  location: string;
  room: string;
  price: number;
};

export async function createEvent(
  data: CreateEventInput,
  token: string
): Promise<Event> {
  const response = await fetch(
    `${API_URL}/events`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message ??
        "Não foi possível criar a sessão"
    );
  }

  return responseData;
}