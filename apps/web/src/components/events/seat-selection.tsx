"use client";

import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { formatCurrency } from "@/lib/format";
import type { Event } from "@/types/event";
import type { EventSeat } from "@/types/seat";
import { Armchair } from "lucide-react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { createReservation } from "@/services/reservations";

type SeatSelectionProps = {
  event: Event;
  seats: EventSeat[];
};

export function SeatSelection({
  event,
  seats,
}: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>(
    []
  );

  const router = useRouter();

  const {
    user,
    token,
    loading: authLoading,
  } = useAuth();

  const [reservationLoading, setReservationLoading] =
    useState(false);

  const [reservationError, setReservationError] =
    useState("");

    useEffect(() => {
    const saved = sessionStorage.getItem(
      "elite_pending_reservation"
    );

    if (!saved) {
      return;
    }

    try {
      const pending = JSON.parse(saved) as {
        eventId: string;
        seatIds: string[];
      };

      if (pending.eventId === event.id) {
        const availableIds = pending.seatIds.filter(
          (seatId) =>
            seats.some(
              (seat) =>
                seat.id === seatId &&
                seat.status === "AVAILABLE"
            )
        );

        setSelectedSeats(availableIds);
      }
    } catch {
      sessionStorage.removeItem(
        "elite_pending_reservation"
      );
    }
  }, [event.id, seats]);

  async function handleContinue() {
    if (selectedSeats.length === 0) {
      return;
    }

    setReservationError("");

    if (authLoading) {
      return;
    }

    if (!user || !token) {
      sessionStorage.setItem(
        "elite_pending_reservation",
        JSON.stringify({
          eventId: event.id,
          seatIds: selectedSeats,
        })
      );

      router.push(
        `/login?redirect=${encodeURIComponent(
          `/eventos/${event.id}`
        )}`
      );

      return;
    }

    if (user.role !== "CUSTOMER") {
      setReservationError(
        "Somente clientes podem realizar reservas."
      );
      return;
    }

    try {
      setReservationLoading(true);

      const reservation = await createReservation({
        eventId: event.id,
        seatIds: selectedSeats,
        token,
      });

      sessionStorage.removeItem(
        "elite_pending_reservation"
      );

      sessionStorage.setItem(
        "elite_current_reservation",
        JSON.stringify(reservation)
      );

      router.push(
        `/checkout/${reservation.id}`
      );
    } catch (error) {
      setReservationError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a reserva"
      );
    } finally {
      setReservationLoading(false);
    }
  }  

  function toggleSeat(seat: EventSeat) {
    if (seat.status !== "AVAILABLE") {
      return;
    }

    setSelectedSeats((current) => {
      if (current.includes(seat.id)) {
        return current.filter((id) => id !== seat.id);
      }

      return [...current, seat.id];
    });
  }

  const selectedSeatObjects = useMemo(
    () =>
      seats.filter((seat) =>
        selectedSeats.includes(seat.id)
      ),
    [seats, selectedSeats]
  );

  const rows = useMemo(() => {
    return seats.reduce<Record<string, EventSeat[]>>(
      (accumulator, seat) => {
        if (!accumulator[seat.row]) {
          accumulator[seat.row] = [];
        }

        accumulator[seat.row].push(seat);

        return accumulator;
      },
      {}
    );
  }, [seats]);

  const total =
    selectedSeatObjects.length * Number(event.price);

  return (
    <section>
      <Container className="py-14 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-(--accent-cyan)">
                  Escolha o seu lugar
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
                  Onde você quer assistir?
                </h2>
              </div>

              <span className="hidden text-xs text-(--muted) md:block">
                {seats.length} lugares
              </span>
            </div>

            <div className="mx-auto mt-16 max-w-3xl">
              <div className="mb-14">
                <div className="h-2 w-full bg-linear-to-r from-transparent via-(--foreground) to-transparent opacity-50" />

                <p className="mt-3 text-center text-[10px] uppercase tracking-[0.35em] text-(--muted)">
                  Tela
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(rows).map(
                  ([row, rowSeats]) => (
                    <div
                      key={row}
                      className="grid grid-cols-[24px_1fr] items-center gap-4"
                    >
                      <span className="text-xs text-(--muted)">
                        {row}
                      </span>

                      <div className="grid grid-cols-8 gap-x-3 gap-y-2 md:gap-x-5">
                        {rowSeats.map((seat) => {
                          const selected =
                            selectedSeats.includes(seat.id);

                          const unavailable =
                            seat.status !== "AVAILABLE";

                          return (
                            <div
                              key={seat.id}
                              className={
                                unavailable
                                  ? "flex justify-center cursor-not-allowed"
                                  : "flex justify-center"
                              }
                            >
                              <button
                                type="button"
                                disabled={unavailable}
                                onClick={() => toggleSeat(seat)}
                                aria-label={`Assento ${seat.row}${seat.number}`}
                                title={`Assento ${seat.row}${seat.number}`}
                                className={`
                                  group
                                  flex
                                  flex-col
                                  items-center
                                  justify-center
                                  gap-1
                                  transition-all
                                  duration-200
                                  ${
                                    unavailable
                                      ? "pointer-events-none opacity-35"
                                      : "cursor-pointer"
                                  }
                                `}
                              >
                                <Armchair
                                  size={30}
                                  strokeWidth={1.6}
                                  className={`
                                    transition-all
                                    duration-200
                                    ${
                                      selected
                                        ? "fill-(--accent-cyan) text-(--accent-cyan)"
                                        : unavailable
                                          ? "fill-(--surface-soft) text-(--muted)"
                                          : "text-(--foreground) group-hover:text-(--accent-cyan)"
                                    }
                                  `}
                                />

                                <span
                                  className={`
                                    text-[9px]
                                    font-medium
                                    transition-colors
                                    ${
                                      selected
                                        ? "text-(--accent-cyan)"
                                        : "text-(--muted)"
                                    }
                                  `}
                                >
                                  {seat.number}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-10 flex flex-wrap gap-6 border-t border-(--border) pt-6">
                <Legend status="available">
                  Disponível
                </Legend>

                <Legend status="selected">
                  Selecionado
                </Legend>

                <Legend status="unavailable">
                  Indisponível
                </Legend>
              </div>
            </div>
          </div>

          <SelectionSummary
            event={event}
            selectedSeats={selectedSeatObjects}
            total={total}
            loading={reservationLoading}
            error={reservationError}
            onContinue={handleContinue}
          />
        </div>
      </Container>
    </section>
  );
}

type LegendProps = {
  status: "available" | "selected" | "unavailable";
  children: React.ReactNode;
};

function Legend({
  status,
  children,
}: LegendProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-(--muted)">
      <Armchair
        size={20}
        strokeWidth={1.6}
        className={
          status === "selected"
            ? "fill-(--accent-cyan) text-(--accent-cyan)"
            : status === "unavailable"
              ? "fill-(--surface-soft) text-(--muted) opacity-35"
              : "text-(--foreground)"
        }
      />

      <span>{children}</span>
    </div>
  );
}

type SelectionSummaryProps = {
  event: Event;
  selectedSeats: EventSeat[];
  total: number;
  loading: boolean;
  error: string;
  onContinue: () => void;
};

function SelectionSummary({
  event,
  selectedSeats,
  total,
  loading,
  error,
  onContinue,
}: SelectionSummaryProps) {
  return (
    <aside className="h-fit border border-(--border) bg-(--surface) p-6 lg:sticky lg:top-8">
      <p className="text-xs uppercase tracking-[0.18em] text-(--muted)">
        Sua seleção
      </p>

      <div className="mt-6 border-b border-(--border) pb-6">
        <p className="font-medium">
          {event.movieTitle}
        </p>

        {selectedSeats.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <span
                key={seat.id}
                className="bg-(--accent-cyan) px-2.5 py-1.5 text-xs font-semibold text-[#0d0d0d]"
              >
                {seat.row}
                {seat.number}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-(--muted)">
            Nenhum assento selecionado.
          </p>
        )}
      </div>

      <div className="flex items-end justify-between py-6">
        <div>
          <span className="block text-xs uppercase tracking-[0.15em] text-(--muted)">
            Total
          </span>

          <strong className="mt-1 block text-2xl tracking-[-0.04em]">
            {formatCurrency(total)}
          </strong>
        </div>

        <span className="text-xs text-(--muted)">
          {selectedSeats.length}{" "}
          {selectedSeats.length === 1
            ? "ingresso"
            : "ingressos"}
        </span>
      </div>

      <button
        type="button"
        disabled={
          selectedSeats.length === 0 ||
          loading
        }
        onClick={onContinue}
        className="
          w-full
          bg-(--accent-green)
          px-5
          py-4
          text-sm
          font-semibold
          text-[#0d0d0d]
          transition
          hover:brightness-110
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        {loading
          ? "Reservando..."
          : "Continuar"}
      </button>

      {error && (
        <p className="mt-4 text-sm text-(--error)">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs leading-5 text-(--muted)">
        Os lugares serão reservados por 10 minutos após
        você continuar.
      </p>
    </aside>
  );
}