export type SeatStatus =
  | "AVAILABLE"
  | "HELD"
  | "SOLD";

export type EventSeat = {
  id: string;
  eventId: string;
  row: string;
  number: number;
  status: SeatStatus;
  heldUntil: string | null;
};