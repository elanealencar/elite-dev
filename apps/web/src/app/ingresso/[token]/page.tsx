import {
  notFound,
} from "next/navigation";
import Image from "next/image";
import {
  Armchair,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { getSharedTicket } from "@/services/tickets";
import {
  formatEventDate,
  formatEventTime,
} from "@/lib/format";

type SharedTicketPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function SharedTicketPage({
  params,
}: SharedTicketPageProps) {
  const { token } = await params;

  let ticket;

  try {
    ticket = await getSharedTicket(token);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Container className="py-8 md:py-14">
        <div className="flex items-center justify-between border-b border-(--border) pb-6">
          <span className="text-xl font-semibold tracking-[-0.04em]">
            ELITE
            <span className="text-(--accent-green)">
              •
            </span>
          </span>

          <span className="text-xs uppercase tracking-[0.16em] text-(--accent-violet)">
            Ingresso compartilhado
          </span>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[320px_1fr] md:py-20">
          <div className="relative aspect-2/3 overflow-hidden bg-(--surface)">
            {ticket.event.posterUrl ? (
              <Image
                src={ticket.event.posterUrl}
                alt={ticket.event.title}
                fill
                sizes="320px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-(--accent-violet)">
                Elite Tickets
              </p>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                {ticket.event.title}
              </h1>

              <div className="mt-10 grid gap-6 border-y border-(--border) py-7 sm:grid-cols-2">
                <TicketInfo
                  icon={CalendarDays}
                  label="Data"
                  value={formatEventDate(
                    ticket.event.dateTime
                  )}
                />

                <TicketInfo
                  icon={Clock3}
                  label="Horário"
                  value={formatEventTime(
                    ticket.event.dateTime
                  )}
                />

                <TicketInfo
                  icon={MapPin}
                  label="Local"
                  value={`${ticket.event.location} · ${ticket.event.room}`}
                />

                <TicketInfo
                  icon={Armchair}
                  label="Assento"
                  value={`${ticket.seat.row}${ticket.seat.number}`}
                />
              </div>
            </div>

            <div className="mt-12 flex items-end justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-[0.15em] text-(--muted)">
                  Código
                </span>

                <strong className="mt-2 block">
                  {ticket.code}
                </strong>
              </div>

              <span
                className={
                  ticket.status === "VALID"
                    ? "text-xs uppercase tracking-[0.15em] text-(--accent-green)"
                    : "text-xs uppercase tracking-[0.15em] text-(--muted)"
                }
              >
                {ticket.status === "VALID"
                  ? "Ingresso válido"
                  : ticket.status === "USED"
                    ? "Ingresso utilizado"
                    : "Ingresso cancelado"}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

type TicketInfoProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function TicketInfo({
  icon: Icon,
  label,
  value,
}: TicketInfoProps) {
  return (
    <div className="flex gap-3">
      <Icon
        size={18}
        className="mt-0.5 text-(--accent-cyan)"
      />

      <div>
        <span className="block text-xs uppercase tracking-[0.12em] text-(--muted)">
          {label}
        </span>

        <span className="mt-1 block text-sm">
          {value}
        </span>
      </div>
    </div>
  );
}