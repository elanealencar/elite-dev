"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  CreditCard,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import type { Reservation } from "@/services/reservations";
import {
  processPayment,
  type PaymentResult,
} from "@/services/payments";
import { formatCurrency } from "@/lib/format";

export default function CheckoutPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const {
    user,
    token,
    loading: authLoading,
  } = useAuth();

  const [reservation, setReservation] =
    useState<Reservation | null>(null);

  const [remainingSeconds, setRemainingSeconds] =
    useState(0);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [error, setError] = useState("");

  const formattedTime = useMemo(() => {
  const minutes = Math.floor(
    remainingSeconds / 60
  );

  const seconds =
    remainingSeconds % 60;

    return `${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(
        2,
        "0"
    )}`;
    }, [remainingSeconds]);

    useEffect(() => {
        const saved = sessionStorage.getItem(
            "elite_current_reservation"
        );

        if (!saved) {
            return;
        }

        try {
            const data = JSON.parse(
            saved
            ) as Reservation;

            if (data.id === params.id) {
            setReservation(data);
            }
        } catch {
            sessionStorage.removeItem(
            "elite_current_reservation"
            );
        }
    }, [params.id]);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user || !token) {
            router.replace("/login");
            return;
        }

        if (user.role !== "CUSTOMER") {
            router.replace("/");
        }
        }, [
        authLoading,
        user,
        token,
        router,
    ]);

    useEffect(() => {
        if (!reservation) {
            return;
        }

        function updateRemainingTime() {
            const expiresAt =
            new Date(reservation!.expiresAt).getTime();

            const now = Date.now();

            const difference = Math.max(
            0,
            Math.floor((expiresAt - now) / 1000)
            );

            setRemainingSeconds(difference);
        }

        updateRemainingTime();

        const interval = window.setInterval(
            updateRemainingTime,
            1000
        );

        return () =>
            window.clearInterval(interval);
    }, [reservation]);


    async function handlePayment(
        result: PaymentResult
        ) {
            if (
                !reservation ||
                !token ||
                paymentLoading
            ) {
                return;
            }

            setError("");
            setPaymentLoading(true);

            try {
                const response = await processPayment({
                    reservationId: reservation.id,
                    result,
                    token,
                });

                if (response.reservationStatus === "PAID") {
                    sessionStorage.removeItem(
                        "elite_current_reservation"
                );

                 sessionStorage.setItem(
                    "elite_payment_success",
                    "true"
                );

                router.push(
                    "/meus-ingressos"
                );

                return;
                }

                sessionStorage.removeItem(
                    "elite_current_reservation"
                );

                router.push(
                    `/eventos/${reservation.eventId}?payment=declined`
                );
            } catch (error) {
                setError(
                error instanceof Error
                    ? error.message
                    : "Não foi possível processar o pagamento"
                );
            } finally {
                setPaymentLoading(false);
            }
        }

        const expired =
            reservation !== null &&
            remainingSeconds === 0;

        if (authLoading) {
            return (
                <main className="flex min-h-screen items-center justify-center">
                    <p className="text-sm text-(--muted)">
                        Carregando...
                    </p>
                </main>
            );
        }

        if (!reservation) {
            return (
                <main className="flex min-h-screen items-center justify-center px-6">
                    <div className="max-w-md text-center">
                        <p className="text-xs uppercase tracking-[0.18em] text-(--accent-violet)">
                            Checkout
                        </p>

                        <h1 className="mt-4 text-3xl font-semibold">
                            Reserva não encontrada.
                        </h1>

                        <p className="mt-4 text-sm leading-6 text-(--muted)">
                            Volte às sessões e selecione seus lugares novamente.
                        </p>

                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="mt-8 bg-(--accent-green) px-5 py-4 font-semibold text-[#0d0d0d]"
                        >
                            Ver sessões
                        </button>
                    </div>
                </main>
            );
        }

        return (
            <main className="min-h-screen">
                <div className="grid min-h-screen lg:grid-cols-[1fr_460px]">
                    <section className="flex flex-col justify-between border-b border-(--border) p-6 md:p-10 lg:border-b-0 lg:border-r">
                        <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() =>
                            router.push(
                                `/eventos/${reservation.eventId}`
                            )
                            }
                            className="text-xl font-semibold tracking-[-0.04em]"
                        >
                            ELITE
                            <span className="text-(--accent-green)">
                            •
                            </span>
                        </button>

                        <div
                            className={`
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            ${
                                expired
                                ? "text-(--error)"
                                : "text-(--accent-cyan)"
                            }
                            `}
                        >
                            <Clock3 size={17} />

                            {formattedTime}
                        </div>
                        </div>

                        <div className="my-16 max-w-3xl">
                        <p className="text-xs uppercase tracking-[0.18em] text-(--accent-cyan)">
                            Sua reserva
                        </p>

                        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                            Seus lugares
                            <br />
                            estão quase
                            <br />
                            garantidos.
                        </h1>
                        </div>

                        <p className="max-w-md text-sm leading-6 text-(--muted)">
                        Finalize o pagamento antes que o tempo termine.
                        Depois disso, os lugares serão liberados novamente.
                        </p>
                    </section>

                    <section className="flex items-center bg-(--surface) p-6 md:p-10">
                        <div className="w-full">
                            <div className="flex items-center gap-3">
                                <CreditCard
                                size={22}
                                className="text-(--accent-violet)"
                                />

                                <p className="text-xs uppercase tracking-[0.18em] text-(--muted)">
                                Pagamento simulado
                                </p>
                            </div>

                            <div className="mt-8 border-y border-(--border)">
                                <div className="py-6">
                                <span className="text-xs uppercase tracking-[0.15em] text-(--muted)">
                                    Assentos
                                </span>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {reservation.seats.map(
                                    (seat) => (
                                        <span
                                        key={seat.id}
                                        className="bg-(--accent-cyan) px-2.5 py-1.5 text-xs font-semibold text-[#0d0d0d]"
                                        >
                                        {seat.eventSeat.row}
                                        {seat.eventSeat.number}
                                        </span>
                                    )
                                    )}
                                </div>
                                </div>

                                <div className="flex items-end justify-between border-t border-(--border) py-6">
                                <span className="text-xs uppercase tracking-[0.15em] text-(--muted)">
                                    Total
                                </span>

                                <strong className="text-3xl tracking-[-0.045em]">
                                    {formatCurrency(
                                    reservation.totalAmount
                                    )}
                                </strong>
                                </div>
                            </div>

                            {expired ? (
                                <div className="mt-8 border border-(--error) p-5">
                                <p className="font-medium text-(--error)">
                                    Sua reserva expirou.
                                </p>

                                <p className="mt-2 text-sm leading-6 text-(--muted)">
                                    Os assentos serão liberados novamente.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                    router.push(
                                        `/eventos/${reservation.eventId}`
                                    )
                                    }
                                    className="mt-5 text-sm font-medium text-(--foreground) underline underline-offset-4"
                                >
                                    Escolher outros lugares
                                </button>
                                </div>
                            ) : (
                                <>
                                <button
                                    type="button"
                                    disabled={paymentLoading}
                                    onClick={() =>
                                    handlePayment("APPROVED")
                                    }
                                    className="
                                    group
                                    mt-8
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    bg-(--accent-green)
                                    px-5
                                    py-4
                                    font-semibold
                                    text-[#0d0d0d]
                                    transition
                                    hover:brightness-110
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    "
                                >
                                    {paymentLoading
                                    ? "Processando..."
                                    : "Confirmar pagamento"}

                                    <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>

                                <button
                                    type="button"
                                    disabled={paymentLoading}
                                    onClick={() =>
                                    handlePayment("DECLINED")
                                    }
                                    className="mt-4 w-full border border-(--border) px-5 py-3 text-xs text-(--muted) transition hover:border-(--error) hover:text-(--error)"
                                >
                                    Simular pagamento recusado
                                </button>
                                </>
                            )}

                            {error && (
                                <p className="mt-5 text-sm text-(--error)">
                                {error}
                                </p>
                            )}

                            <p className="mt-7 text-xs leading-5 text-(--muted)">
                                Nenhuma transação financeira real é realizada neste projeto.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        );
}

