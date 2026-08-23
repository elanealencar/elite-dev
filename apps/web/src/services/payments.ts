export type PaymentResult =
  | "APPROVED"
  | "DECLINED";

type ProcessPaymentInput = {
  reservationId: string;
  result: PaymentResult;
  token: string;
};

type PaymentResponse = {
  payment: {
    id: string;
    reservationId: string;
    amount: string;
    status: "APPROVED" | "DECLINED";
    createdAt: string;
  };

  reservationStatus:
    | "PAID"
    | "PAYMENT_FAILED";

  tickets?: Array<{
    id: string;
    reservationId: string;
    reservationSeatId: string;
    code: string;
    shareToken: string;
    status: "VALID";
    usedAt: string | null;
  }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function processPayment({
  reservationId,
  result,
  token,
}: ProcessPaymentInput): Promise<PaymentResponse> {
  const response = await fetch(
    `${API_URL}/reservations/${reservationId}/pay`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        result,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "Não foi possível processar o pagamento"
    );
  }

  return data;
}