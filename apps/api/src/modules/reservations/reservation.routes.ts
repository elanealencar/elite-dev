import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorize-role.js";
import { createReservation } from "./reservation.controller.js";

export const reservationRoutes = Router();

reservationRoutes.post(
  "/",
  authenticate,
  authorizeRole("CUSTOMER"),
  createReservation
);