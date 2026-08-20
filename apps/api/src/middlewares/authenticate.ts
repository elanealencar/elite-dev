import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = {
  sub: string;
  role: "ORGANIZER" | "CUSTOMER" | "GATE";
};

export function authenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Unauthorized",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return response.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    request.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    return response.status(401).json({
      message: "Invalid token",
    });
  }
}