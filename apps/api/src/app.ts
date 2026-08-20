import cors from "cors";
import express from "express";
import { prisma } from "./database/prisma.js";
import { eventRoutes } from "./modules/events/event.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { catalogRoutes } from "./modules/catalog/catalog.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/events", eventRoutes);
app.use("/auth", authRoutes);
app.use("/catalog", catalogRoutes);

app.get("/health/db", async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return response.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch {
    return response.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});