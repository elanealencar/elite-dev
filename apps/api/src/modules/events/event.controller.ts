import type { Request, Response } from "express";
import { createEventService } from "./event.service.js";

export async function createEvent(request: Request, response: Response) {
  try {
    const event = await createEventService(request.body);

    return response.status(201).json(event);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "Internal server error",
    });
  }
}