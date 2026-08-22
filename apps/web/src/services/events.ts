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