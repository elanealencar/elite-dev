import type { NextFunction, Request, Response } from "express";

type Role = "ORGANIZER" | "CUSTOMER" | "GATE";

export function authorizeRole(...allowedRoles: Role[]) {
  return (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if (!request.user) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({
        message: "Forbidden",
      });
    }

    return next();
  };
}