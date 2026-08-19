import { Router } from "express";
import { createEvent } from "./event.controller.js";

export const eventRoutes = Router();

eventRoutes.post("/", createEvent);