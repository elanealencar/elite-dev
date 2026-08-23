"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  QrCode,
  X,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { getTicketQrCode } from "@/services/tickets";
import type {
  Ticket,
  TicketQrResponse,
} from "@/types/ticket";

type TicketQrModalProps = {
  ticket: Ticket;
  onClose: () => void;
};

export function TicketQrModal({
  ticket,
  onClose,
}: TicketQrModalProps) {
  const { token } = useAuth();

  const [qr, setQr] =
    useState<TicketQrResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadQr() {
      try {
        const data = await getTicketQrCode(
          ticket.id,
          token!
        );

        setQr(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o QR Code"
        );
      } finally {
        setLoading(false);
      }
    }

    loadQr();
  }, [ticket.id, token]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border border-(--border) bg-(--surface) p-6"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-(--accent-violet)">
              Seu ingresso
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {ticket.reservation.event.movieTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-(--muted) transition hover:text-(--foreground)"
          >
            <X size={21} />
          </button>
        </div>

        <div className="mt-8 flex min-h-72 items-center justify-center bg-white p-6">
          {loading ? (
            <QrCode
              size={42}
              className="animate-pulse text-black/30"
            />
          ) : error ? (
            <p className="text-center text-sm text-(--error)">
              {error}
            </p>
          ) : qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qr.qrCode}
              alt={`QR Code do ingresso ${ticket.code}`}
              className="h-auto w-full max-w-64"
            />
          ) : null}
        </div>

        <div className="mt-6 flex justify-between gap-4 text-sm">
          <div>
            <span className="block text-xs uppercase tracking-[0.12em] text-(--muted)">
              Assento
            </span>

            <strong className="mt-1 block text-(--accent-cyan)">
              {
                ticket.reservationSeat
                  .eventSeat.row
              }
              {
                ticket.reservationSeat
                  .eventSeat.number
              }
            </strong>
          </div>

          <div className="text-right">
            <span className="block text-xs uppercase tracking-[0.12em] text-(--muted)">
              Código
            </span>

            <strong className="mt-1 block">
              {ticket.code}
            </strong>
          </div>
        </div>

        <p className="mt-6 text-xs leading-5 text-(--muted)">
          Apresente este QR Code na entrada da
          sessão. Cada ingresso pode ser validado
          apenas uma vez.
        </p>
      </div>
    </div>
  );
}