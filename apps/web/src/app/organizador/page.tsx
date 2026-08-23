"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Plus,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { useAuth } from "@/components/providers/auth-provider";
import {
  getOrganizerEvents,
  publishEvent,
} from "@/services/events";
import type { Event } from "@/types/event";
import {
  formatCurrency,
  formatEventDate,
  formatEventTime,
} from "@/lib/format";

export default function OrganizerPage() {
  const router = useRouter();

  const {
    user,
    token,
    loading: authLoading,
    logout,
  } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishingId, setPublishingId] =
    useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
        return;
    }

    if (!user || !token) {
        router.replace("/login");
        return;
    }

    if (user.role !== "ORGANIZER") {
        router.replace("/");
    }
    }, [
    authLoading,
    user,
    token,
    router,
    ]);

    useEffect(() => {
        if (
            authLoading ||
            !user ||
            !token ||
            user.role !== "ORGANIZER"
        ) {
            return;
        }

        const authToken = token;

        async function loadEvents() {
            try {
            setError("");

            const data = await getOrganizerEvents(authToken);
            setEvents(data);
            } catch (error) {
            setError(
                error instanceof Error
                ? error.message
                : "Não foi possível carregar seus eventos"
            );
            } finally {
                setLoading(false);
            }
        }

        loadEvents();
        }, [
        authLoading,
        user,
        token,
    ]);

    const summary = useMemo(() => {
    const published = events.filter(
        (event) => event.status === "PUBLISHED"
    ).length;

    const drafts = events.filter(
        (event) => event.status === "DRAFT"
    ).length;

    const cancelled = events.filter(
        (event) => event.status === "CANCELLED"
    ).length;

    return {
        published,
        drafts,
        cancelled,
    };
    }, [events]);

    async function handlePublish(
        eventId: string
    ) {
        if (!token) {
            return;
        }

        try {
            setError("");
            setPublishingId(eventId);

            const updated = await publishEvent(
                eventId,
                token
            );

            setEvents((current) =>
                current.map((event) =>
                    event.id === updated.id
                    ? updated
                    : event
                )
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Não foi possível publicar o evento"
            );
        } finally {
            setPublishingId(null);
        }
    }

    if (authLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-(--muted)">
                    Carregando...
                </p>
            </main>
        );
    }

    if (!user || user.role !== "ORGANIZER") {
        return null;
    }

    return (
    <main className="min-h-screen">
        <header className="border-b border-(--border)">
        <Container>
            <div className="flex min-h-20 items-center justify-between gap-6">
            <button
                type="button"
                onClick={() =>
                router.push("/organizador")
                }
                className="text-xl font-semibold tracking-[-0.04em]"
            >
                ELITE
                <span className="text-(--accent-green)">
                •
                </span>
            </button>

            <div className="flex items-center gap-6">
                <span className="hidden text-xs text-(--muted) sm:block">
                {user.name}
                </span>

                <button
                type="button"
                onClick={() => {
                    logout();
                    router.push("/login");
                }}
                className="border-b border-(--foreground) pb-1 text-sm transition-colors hover:border-(--accent-green) hover:text-(--accent-green)"
                >
                Sair
                </button>
            </div>
            </div>
        </Container>
        </header>

        <section className="border-b border-(--border)">
        <Container className="py-14 md:py-20">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
                <p className="text-xs uppercase tracking-[0.18em] text-(--accent-green)">
                Painel do organizador
                </p>

                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                Suas sessões,
                <br />
                em um só lugar.
                </h1>
            </div>

            <button
                type="button"
                onClick={() =>
                router.push(
                    "/organizador/eventos/novo"
                )
                }
                className="group flex items-center justify-between gap-8 bg-(--accent-green) px-5 py-4 text-sm font-semibold text-[#0d0d0d]"
            >
                <span className="flex items-center gap-2">
                <Plus size={17} />
                Criar sessão
                </span>

                <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
                />
            </button>
            </div>

            <div className="mt-14 grid border-y border-(--border) sm:grid-cols-3">
            <SummaryItem
                label="Publicadas"
                value={summary.published}
                color="text-(--accent-green)"
            />

            <SummaryItem
                label="Rascunhos"
                value={summary.drafts}
                color="text-(--accent-cyan)"
            />

            <SummaryItem
                label="Canceladas"
                value={summary.cancelled}
                color="text-(--muted)"
            />
            </div>
        </Container>
        </section>

        <section>
        <Container className="py-12 md:py-16">
            <div className="flex items-end justify-between border-b border-(--border) pb-5">
            <div>
                <p className="text-xs uppercase tracking-[0.18em] text-(--muted)">
                Programação
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                Seus eventos
                </h2>
            </div>

            <span className="text-xs text-(--muted)">
                {events.length} registros
            </span>
            </div>

            {error && (
            <p className="mt-6 text-sm text-(--error)">
                {error}
            </p>
            )}

            {loading ? (
            <p className="py-14 text-sm text-(--muted)">
                Carregando eventos...
            </p>
            ) : events.length === 0 ? (
            <EmptyOrganizerState
                onCreate={() =>
                router.push(
                    "/organizador/eventos/novo"
                )
                }
            />
            ) : (
            <div>
                {events.map((event, index) => (
                <OrganizerEventRow
                    key={event.id}
                    event={event}
                    index={index}
                    publishing={
                    publishingId === event.id
                    }
                    onPublish={() =>
                    handlePublish(event.id)
                    }
                />
                ))}
            </div>
            )}
        </Container>
        </section>
    </main>
    );
}

type SummaryItemProps = {
label: string;
value: number;
color: string;
};

function SummaryItem({
    label,
    value,
    color,
}: SummaryItemProps) {
    return (
        <div className="border-b border-(--border) py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
        <span className="text-xs uppercase tracking-[0.14em] text-(--muted)">
            {label}
        </span>

        <strong
            className={`mt-3 block text-4xl font-semibold tracking-[-0.055em] ${color}`}
        >
            {String(value).padStart(2, "0")}
        </strong>
        </div>
    );
}

type OrganizerEventRowProps = {
    event: Event;
    index: number;
    publishing: boolean;
    onPublish: () => void;
};

function OrganizerEventRow({
    event,
    index,
    publishing,
    onPublish,
}: OrganizerEventRowProps) {
    const status =
        event.status === "PUBLISHED"
        ? {
            label: "Publicado",
            className: "text-(--accent-green)",
        }
        : event.status === "DRAFT"
            ? {
                label: "Rascunho",
                className: "text-(--accent-cyan)",
            }
            : {
                label: "Cancelado",
                className: "text-(--muted)",
        };

    return (
        <article className="grid gap-6 border-b border-(--border) py-7 md:grid-cols-[60px_1.4fr_1fr_140px] md:items-center">
            <span className="text-xs text-(--muted)">
                {String(index + 1).padStart(
                2,
                "0"
                )}
            </span>

            <div>
                <h3 className="text-xl font-semibold tracking-[-0.04em]">
                {event.movieTitle}
                </h3>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-(--muted)">
                <span className="flex items-center gap-1.5">
                    <CalendarDays size={13} />

                    {formatEventDate(
                    event.dateTime
                    )}
                </span>

                <span>
                    {formatEventTime(
                    event.dateTime
                    )}
                </span>

                <span>{event.room}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5 text-sm">
                <div>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-(--muted)">
                    Ingresso
                </span>

                <span className="mt-1 block">
                    {formatCurrency(event.price)}
                </span>
                </div>

                <div>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-(--muted)">
                    Status
                </span>

                <span
                    className={`mt-1 block ${status.className}`}
                >
                    {status.label}
                </span>
                </div>
            </div>

            <div className="flex md:justify-end">
                {event.status === "DRAFT" ? (
                <button
                    type="button"
                    disabled={publishing}
                    onClick={onPublish}
                    className="border-b border-(--accent-green) pb-1 text-sm text-(--accent-green) transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
                >
                    {publishing
                    ? "Publicando..."
                    : "Publicar →"}
                </button>
                ) : (
                <span className="text-xs text-(--muted)">
                    —
                </span>
                )}
            </div>
        </article>
    );
}

type EmptyOrganizerStateProps = {
    onCreate: () => void;
};

function EmptyOrganizerState({
    onCreate,
}: EmptyOrganizerStateProps) {
    return (
        <div className="py-20">
            <p className="text-sm text-(--muted)">
                Nenhuma sessão cadastrada ainda.
            </p>

            <button
                type="button"
                onClick={onCreate}
                className="mt-6 flex items-center gap-2 text-sm font-medium text-(--accent-green)"
            >
                <Plus size={16} />
                Criar primeira sessão
            </button>
        </div>
    );
}