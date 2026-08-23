"use client";

import { useState } from "react";
import {
  ExternalLink,
  QrCode,
  Share2,
} from "lucide-react";

import type { Ticket } from "@/types/ticket";
import {
  formatEventDate,
  formatEventTime,
} from "@/lib/format";

import { TicketQrModal } from "@/components/tickets/ticket-qr-modal";

type TicketCardProps = {
  ticket: Ticket;
};

export function TicketCard({
  ticket,
}: TicketCardProps) {
  const [qrOpen, setQrOpen] =
    useState(false);

  const event = ticket.reservation.event;
  const seat =
    ticket.reservationSeat.eventSeat;

  const statusLabel =
    ticket.status === "VALID"
      ? "Válido"
      : ticket.status === "USED"
        ? "Utilizado"
        : "Cancelado";

  async function handleShare() {
    const url = `${window.location.origin}/ingresso/${ticket.shareToken}`;

    if (navigator.share) {
      await navigator.share({
        title: `${event.movieTitle} — ${seat.row}${seat.number}`,
        text: "Meu ingresso Elite Tickets",
        url,
      });

      return;
    }

    await navigator.clipboard.writeText(url);
  }

  return (
    <>
      <article className="relative overflow-hidden border border-(--border) bg-(--surface)">
        <div className="grid md:grid-cols-[1fr_130px]">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.16em] text-(--accent-violet)">
                  Ingresso digital
                </span>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em]">
                  {event.movieTitle}
                </h2>
              </div>

              <span
                className={`
                  text-xs
                  uppercase
                  tracking-[0.12em]
                  ${
                    ticket.status === "VALID"
                      ? "text-(--accent-green)"
                      : "text-(--muted)"
                  }
                `}
              >
                {statusLabel}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-y border-(--border) py-5 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-[0.12em] text-(--muted)">
                  Data
                </span>

                <span className="mt-1 block">
                  {formatEventDate(
                    event.dateTime
                  )}
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-[0.12em] text-(--muted)">
                  Horário
                </span>

                <span className="mt-1 block">
                  {formatEventTime(
                    event.dateTime
                  )}
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-[0.12em] text-(--muted)">
                  Sala
                </span>

                <span className="mt-1 block">
                  {event.room}
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-[0.12em] text-(--muted)">
                  Assento
                </span>

                <span className="mt-1 block font-semibold text-(--accent-cyan)">
                  {seat.row}
                  {seat.number}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setQrOpen(true)}
                className="flex items-center gap-2 bg-(--accent-violet) px-4 py-3 text-sm font-semibold text-white"
              >
                <QrCode size={17} />
                Ver QR Code
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 border border-(--border) px-4 py-3 text-sm transition hover:border-(--accent-cyan)"
              >
                <Share2 size={16} />
                Compartilhar
              </button>
            </div>
          </div>

          <div className="relative flex min-h-32 items-center justify-center border-t border-dashed border-(--border) bg-(--background) md:border-l md:border-t-0">
            <div className="text-center">
              <span className="block text-xs uppercase tracking-[0.15em] text-(--muted)">
                Assento
              </span>

              <strong className="mt-2 block text-4xl tracking-[-0.06em] text-(--accent-cyan)">
                {seat.row}
                {seat.number}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-(--border) px-6 py-4 text-[10px] uppercase tracking-[0.14em] text-(--muted)">
          <span>{ticket.code}</span>

          <ExternalLink size={13} />
        </div>
      </article>

      {qrOpen && (
        <TicketQrModal
          ticket={ticket}
          onClose={() => setQrOpen(false)}
        />
      )}
    </>
  );
}