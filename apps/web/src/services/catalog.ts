import type { Movie } from "@/types/movie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchMovies(
  query: string
): Promise<Movie[]> {
  const response = await fetch(
    `${API_URL}/catalog/movies?query=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Não foi possível buscar os filmes"
    );
  }

  return data;
}