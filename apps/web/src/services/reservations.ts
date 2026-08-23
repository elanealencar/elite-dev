type CreateReservationInput = {
  eventId: string;
  seatIds: string[];
  token: string;
};

export type ReservationSeat = {
  id: string;
  eventSeatId: string;
  price: string;

  eventSeat: {
    id: string;
    row: string;
    number: number;
    status: "AVAILABLE" | "HELD" | "SOLD";
    heldUntil: string | null;
  };
};

export type Reservation = {
  id: string;
  customerId: string;
  eventId: string;
  status:
    | "PENDING_PAYMENT"
    | "PAID"
    | "PAYMENT_FAILED"
    | "EXPIRED"
    | "CANCELLED";
  expiresAt: string;
  totalAmount: string;
  seats: ReservationSeat[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createReservation({
  eventId,
  seatIds,
  token,
}: CreateReservationInput): Promise<Reservation> {
  const response = await fetch(`${API_URL}/reservations`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      eventId,
      seatIds,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Não foi possível criar a reserva"
    );
  }

  return data;
}