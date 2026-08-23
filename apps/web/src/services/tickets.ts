import type {
  SharedTicket,
  Ticket,
  TicketQrResponse,
} from "@/types/ticket";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMyTickets(
  token: string
): Promise<Ticket[]> {
  const response = await fetch(
    `${API_URL}/tickets/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Não foi possível carregar seus ingressos"
    );
  }

  return data;
}

export async function getTicketQrCode(
  ticketId: string,
  token: string
): Promise<TicketQrResponse> {
  const response = await fetch(
    `${API_URL}/tickets/${ticketId}/qr`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Não foi possível carregar o QR Code"
    );
  }

  return data;
}

export async function getSharedTicket(
  shareToken: string
): Promise<SharedTicket> {
  const response = await fetch(
    `${API_URL}/tickets/share/${shareToken}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Não foi possível carregar o ingresso"
    );
  }

  return data;
}