import type { Request, Response } from "express";
import { searchMoviesService } from "./catalog.service.js";

export async function searchMovies(
  request: Request,
  response: Response
) {
  try {
    const query = request.query.query;

    if (typeof query !== "string" || !query.trim()) {
      return response.status(400).json({
        message: "Query is required",
      });
    }

    const movies = await searchMoviesService(query);

    return response.status(200).json(movies);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "TMDB_REQUEST_FAILED"
    ) {
      return response.status(502).json({
        message: "Failed to fetch movies from TMDb",
      });
    }

    return response.status(500).json({
      message: "Erro interno do servidor",
    });
  }
}