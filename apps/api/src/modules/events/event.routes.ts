import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEventSeats,
  listEvents,
} from "./event.controller.js";
export const eventRoutes = Router();

eventRoutes.get("/", listEvents);

eventRoutes.get("/:id/seats", getEventSeats);

eventRoutes.get("/:id", getEventById);

eventRoutes.post("/", createEvent);