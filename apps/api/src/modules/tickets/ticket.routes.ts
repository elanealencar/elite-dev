import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorize-role.js";
import { listCustomerTickets } from "./ticket.controller.js";

export const ticketRoutes = Router();

ticketRoutes.get(
  "/me",
  authenticate,
  authorizeRole("CUSTOMER"),
  listCustomerTickets
);