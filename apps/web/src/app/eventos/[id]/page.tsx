import { notFound } from "next/navigation";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { SeatSelection } from "@/components/events/seat-selection";

import { getEventById } from "@/services/events";
import { getEventSeats } from "@/services/seats";
import {
  formatCurrency,
  formatEventDate,
  formatEventTime,
} from "@/lib/format";

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventPage({
  params,
}: EventPageProps) {
  const { id } = await params;

  const [event, seats] = await Promise.all([
    getEventById(id),
    getEventSeats(id),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header />

      <main>
        <section className="border-b border-(--border)">
          <Container className="py-12 md:py-16">
            <p className="text-xs uppercase tracking-[0.18em] text-(--accent-green)">
              Sessão
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              {event.movieTitle}
            </h1>

            <div className="mt-10 grid gap-6 border-t border-(--border) pt-6 text-sm md:grid-cols-4">
              <div>
                <span className="block text-xs uppercase tracking-[0.15em] text-(--muted)">
                  Data
                </span>

                <span className="mt-2 block">
                  {formatEventDate(event.dateTime)}
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-[0.15em] text-(--muted)">
                  Horário
                </span>

                <span className="mt-2 block">
                  {formatEventTime(event.dateTime)}
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-[0.15em] text-(--muted)">
                  Sala
                </span>

                <span className="mt-2 block">
                  {event.room}
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase tracking-[0.15em] text-(--muted)">
                  Ingresso
                </span>

                <span className="mt-2 block">
                  {formatCurrency(event.price)}
                </span>
              </div>
            </div>
          </Container>
        </section>

        <SeatSelection
          event={event}
          seats={seats}
        />
      </main>

      <Footer />
    </>
  );
}