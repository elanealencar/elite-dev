import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEventSeats,
  listEvents,
} from "./event.controller.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorize-role.js";

export const eventRoutes = Router();

eventRoutes.get("/", listEvents);

eventRoutes.get("/:id/seats", getEventSeats);

eventRoutes.get("/:id", getEventById);

eventRoutes.post(
  "/",
  authenticate,
  authorizeRole("ORGANIZER"),
  createEvent
);