export type TicketStatus =
  | "VALID"
  | "USED"
  | "CANCELLED";

export type Ticket = {
  id: string;
  reservationId: string;
  reservationSeatId: string;
  code: string;
  shareToken: string;
  status: TicketStatus;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;

  reservationSeat: {
    id: string;
    eventSeatId: string;
    price: string;

    eventSeat: {
      id: string;
      row: string;
      number: number;
      status: "AVAILABLE" | "HELD" | "SOLD";
    };
  };

  reservation: {
    id: string;

    event: {
      id: string;
      movieTitle: string;
      moviePosterUrl: string | null;
      dateTime: string;
      location: string;
      room: string;
      price: string;
    };
  };
};

export type TicketQrResponse = {
  ticketId: string;
  code: string;
  qrToken: string;
  qrCode: string;
};

export type SharedTicket = {
  id: string;
  code: string;
  status: TicketStatus;

  event: {
    title: string;
    posterUrl: string | null;
    dateTime: string;
    location: string;
    room: string;
  };

  seat: {
    row: string;
    number: number;
  };
};