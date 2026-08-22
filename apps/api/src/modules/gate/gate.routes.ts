import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorize-role.js";
import { validateTicket } from "./gate.controller.js";

export const gateRoutes = Router();

gateRoutes.post(
  "/validate",
  authenticate,
  authorizeRole("GATE"),
  validateTicket
);