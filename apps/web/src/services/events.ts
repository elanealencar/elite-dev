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