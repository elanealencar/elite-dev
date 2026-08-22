export type UserRole =
  | "CUSTOMER"
  | "ORGANIZER"
  | "GATE";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};