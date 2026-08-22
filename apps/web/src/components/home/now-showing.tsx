import type { Event } from "@/types/event";

import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MovieCard } from "@/components/events/movie-card";

type NowShowingProps = {
  events: Event[];
};

export function NowShowing({
  events,
}: NowShowingProps) {
  return (
    <section
      id="em-cartaz"
      className="border-b border-(--border)"
    >
      <Container className="py-16 md:py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <Eyebrow>Em cartaz</Eyebrow>

            <h2 className="mt-5 text-4xl font-semibold tracking-tighter md:text-6xl">
              Escolha sua sessão.
            </h2>
          </div>

          <span className="hidden text-sm text-(--muted) md:block">
            {String(events.length).padStart(2, "0")} sessões
          </span>
        </div>

        {events.length === 0 ? (
          <div className="border-t border-(--border) py-16 text-(--muted) ">
            Nenhuma sessão disponível no momento.
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <MovieCard
                key={event.id}
                event={event}
                index={index}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}