import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEventSeats,
  listEvents,
  listOrganizerEvents,
  publishEvent,
} from "./event.controller.js";

import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorize-role.js";

export const eventRoutes = Router();

eventRoutes.get("/", listEvents);

eventRoutes.get(
  "/organizer/me",
  authenticate,
  authorizeRole("ORGANIZER"),
  listOrganizerEvents
);

eventRoutes.get("/:id/seats", getEventSeats);

eventRoutes.patch(
  "/:id/publish",
  authenticate,
  authorizeRole("ORGANIZER"),
  publishEvent
);

eventRoutes.get("/:id", getEventById);

eventRoutes.post(
  "/",
  authenticate,
  authorizeRole("ORGANIZER"),
  createEvent
);
