"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Ticket as TicketIcon,
} from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { useAuth } from "@/components/providers/auth-provider";
import { getMyTickets } from "@/services/tickets";
import type { Ticket } from "@/types/ticket";
import { TicketCard } from "@/components/tickets/ticket-card";

export default function MyTicketsPage() {
  const router = useRouter();

  const {
    user,
    token,
    loading: authLoading,
  } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !token) {
      router.replace(
        "/login?redirect=/meus-ingressos"
      );
      return;
    }

    if (user.role !== "CUSTOMER") {
      router.replace("/");
      return;
    }

    const authToken = token;

    async function loadTickets() {
      try {
        const data = await getMyTickets(authToken);
        setTickets(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar seus ingressos"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, [
    authLoading,
    user,
    token,
    router,
  ]);

  useEffect(() => {
    const success = sessionStorage.getItem(
      "elite_payment_success"
    );

    if (success === "true") {
      setPaymentSuccess(true);

      sessionStorage.removeItem(
        "elite_payment_success"
      );
    }
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen">
        <section className="border-b border-(--border)">
          <Container className="py-14 md:py-20">
            <p className="text-xs uppercase tracking-[0.18em] text-(--accent-violet)">
              Sua carteira
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h1 className="text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                Meus ingressos.
              </h1>

              <span className="text-sm text-(--muted)">
                {tickets.length}{" "}
                {tickets.length === 1
                  ? "ingresso"
                  : "ingressos"}
              </span>
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          {paymentSuccess && (
            <div className="mb-10 flex items-center gap-3 border border-(--accent-green) p-4 text-sm">
              <CheckCircle2
                size={19}
                className="text-(--accent-green)"
              />
              Pagamento confirmado. Seus ingressos
              já estão disponíveis.
            </div>
          )}

          {loading ? (
            <p className="text-sm text-(--muted)">
              Carregando ingressos...
            </p>
          ) : error ? (
            <p className="text-sm text-(--error)">
              {error}
            </p>
          ) : tickets.length === 0 ? (
            <div className="border-y border-(--border) py-20 text-center">
              <TicketIcon
                size={30}
                className="mx-auto text-(--muted)"
              />

              <h2 className="mt-5 text-2xl font-semibold">
                Nenhum ingresso por aqui.
              </h2>

              <p className="mt-3 text-sm text-(--muted)">
                Escolha uma sessão e garanta seu lugar.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                />
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}