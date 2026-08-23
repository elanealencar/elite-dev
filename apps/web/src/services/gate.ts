import type { GateValidationResponse } from "@/types/gate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ValidateTicketInput = {
  eventId: string;
  token: string;
  code?: string;
  qrToken?: string;
};

export async function validateTicket({
  eventId,
  token,
  code,
  qrToken,
}: ValidateTicketInput): Promise<GateValidationResponse> {
  const response = await fetch(
    `${API_URL}/gate/validate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        eventId,
        ...(code ? { code } : {}),
        ...(qrToken ? { qrToken } : {}),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Não foi possível validar o ingresso"
    );
  }

  return data;
}