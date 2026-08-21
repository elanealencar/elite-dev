import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorize-role.js";
import { listCustomerTickets, getTicketQrCode, getSharedTicket } from "./ticket.controller.js";

export const ticketRoutes = Router();

ticketRoutes.get(
  "/me",
  authenticate,
  authorizeRole("CUSTOMER"),
  listCustomerTickets
);

ticketRoutes.get(
  "/share/:token",
  getSharedTicket
);

ticketRoutes.get(
  "/:id/qr",
  authenticate,
  authorizeRole("CUSTOMER"),
  getTicketQrCode
);
