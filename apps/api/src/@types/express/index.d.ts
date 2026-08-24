declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "ORGANIZER" | "CUSTOMER" | "GATE";
      };
    }
  }
}

export {};