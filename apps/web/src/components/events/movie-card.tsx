import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Event } from "@/types/event";
import {
  formatCurrency,
  formatEventDate,
  formatEventTime,
} from "@/lib/format";

type MovieCardProps = {
  event: Event;
  index: number;
};

export function MovieCard({
  event,
  index,
}: MovieCardProps) {
  return (
    <Link
      href={`/eventos/${event.id}`}
      className="group block"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-black">
        {event.moviePosterUrl ? (
          <Image
            src={event.moviePosterUrl}
            alt={event.movieTitle}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/50">
            Sem imagem
          </div>
        )}

        <span className="absolute left-4 top-4 bg-(--accent-green) px-3 py-2 text-xs font-semibold text-black">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="border-b border-(--border) py-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.04em]">
              {event.movieTitle}
            </h3>

            <p className="mt-2 text-sm text-(--muted)">
              {formatEventDate(event.dateTime)} ·{" "}
              {formatEventTime(event.dateTime)}
            </p>
          </div>

          <ArrowUpRight
            size={20}
            className="mt-1 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
          />
        </div>

        <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.12em] text-(--muted)">
          <span>{event.room}</span>
          <span>{formatCurrency(event.price)}</span>
        </div>
      </div>
    </Link>
  );
}