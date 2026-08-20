import { Router } from "express";
import { searchMovies } from "./catalog.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorizeRole } from "../../middlewares/authorize-role.js";

export const catalogRoutes = Router();

catalogRoutes.get(
  "/movies",
  authenticate,
  authorizeRole("ORGANIZER"),
  searchMovies
);