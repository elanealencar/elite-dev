declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: "ORGANIZER" | "CUSTOMER" | "GATE";
    };
  }
}