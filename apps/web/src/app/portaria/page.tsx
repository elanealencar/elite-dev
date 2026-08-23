"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  CircleX,
  LogOut,
  ScanLine,
  ShieldAlert,
  TicketCheck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { useAuth } from "@/components/providers/auth-provider";
import { getEvents } from "@/services/events";
import { validateTicket } from "@/services/gate";
import type { Event } from "@/types/event";
import type {
  GateValidationResponse,
  GateValidationResult,
} from "@/types/gate";

export default function GatePage() {
  const router = useRouter();

  const {
    user,
    token,
    loading: authLoading,
    logout,
  } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] =
    useState("");

  const [code, setCode] = useState("");

  const [loadingEvents, setLoadingEvents] =
    useState(true);

  const [validating, setValidating] =
    useState(false);

  const [error, setError] = useState("");

  const [result, setResult] =
    useState<GateValidationResponse | null>(
      null
    );

  useEffect(() => {
    if (authLoading) {
        return;
    }

    if (!user || !token) {
        router.replace("/login");
        return;
    }

    if (user.role !== "GATE") {
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
            user.role !== "GATE"
        ) {
            return;
        }

        async function loadEvents() {
            try {
            setError("");

            const data = await getEvents();

            setEvents(data);

            if (data.length > 0) {
                setSelectedEventId(data[0].id);
            }
            } catch (error) {
            setError(
                error instanceof Error
                ? error.message
                : "Não foi possível carregar os eventos"
            );
            } finally {
            setLoadingEvents(false);
            }
        }

    loadEvents();
    }, [
        authLoading,
        user,
        token,
    ]);

    async function handleValidateCode(
        event: FormEvent<HTMLFormElement>
        ) {
        event.preventDefault();

        if (
            !token ||
            !selectedEventId ||
            !code.trim()
        ) {
            return;
        }

        try {
            setValidating(true);
            setError("");
            setResult(null);

            const response = await validateTicket({
            eventId: selectedEventId,
            token,
            code: code.trim(),
            });

            setResult(response);

            if (response.result === "VALID") {
            setCode("");
            }
        } catch (error) {
            setError(
            error instanceof Error
                ? error.message
                : "Não foi possível validar o ingresso"
            );
        } finally {
            setValidating(false);
        }
    }

    async function handleQrToken(
        qrToken: string
        ) {
        if (!token || !selectedEventId) {
            return;
        }

        try {
            setValidating(true);
            setError("");
            setResult(null);

            const response = await validateTicket({
            eventId: selectedEventId,
            token,
            qrToken,
            });

            setResult(response);
        } catch (error) {
            setError(
            error instanceof Error
                ? error.message
                : "Não foi possível validar o QR Code"
            );
        } finally {
            setValidating(false);
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

        if (!user || user.role !== "GATE") {
        return null;
        }

    return (
        <main className="min-h-screen">
            <header className="border-b border-(--border)">
            <Container>
                <div className="flex min-h-20 items-center justify-between">
                <span className="text-xl font-semibold tracking-[-0.04em]">
                    ELITE
                    <span className="text-(--accent-green)">
                    •
                    </span>
                </span>

                <div className="flex items-center gap-5">
                    <span className="hidden text-xs text-(--muted) sm:block">
                    {user.name}
                    </span>

                    <button
                    type="button"
                    onClick={() => {
                        logout();
                        router.push("/login");
                    }}
                    className="flex items-center gap-2 text-sm text-(--muted) transition hover:text-(--foreground)"
                    >
                    <LogOut size={15} />
                    Sair
                    </button>
                </div>
                </div>
            </Container>
            </header>

            <Container className="py-10 md:py-14">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
                <section>
                <p className="text-xs uppercase tracking-[0.18em] text-(--accent-green)">
                    Portaria
                </p>

                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] md:text-5xl">
                    Validação de
                    <br />
                    ingressos.
                </h1>

                <div className="mt-10">
                    <label className="block">
                    <span className="text-xs uppercase tracking-[0.14em] text-(--muted)">
                        Evento
                    </span>

                    <select
                        value={selectedEventId}
                        onChange={(event) => {
                        setSelectedEventId(
                            event.target.value
                        );

                        setResult(null);
                        }}
                        disabled={loadingEvents}
                        className="mt-3 w-full border-b border-(--border) bg-(--background) py-3 outline-none focus:border-(--accent-cyan)"
                    >
                        {events.length === 0 && (
                        <option value="">
                            Nenhum evento disponível
                        </option>
                        )}

                        {events.map((event) => (
                        <option
                            key={event.id}
                            value={event.id}
                        >
                            {event.movieTitle} —{" "}
                            {event.room}
                        </option>
                        ))}
                    </select>
                    </label>
                </div>

                <form
                    onSubmit={handleValidateCode}
                    className="mt-10"
                >
                    <label className="block">
                    <span className="text-xs uppercase tracking-[0.14em] text-(--muted)">
                        Código do ingresso
                    </span>

                    <div className="mt-3 flex border-b border-(--border)">
                        <input
                        type="text"
                        value={code}
                        onChange={(event) =>
                            setCode(
                            event.target.value.toUpperCase()
                            )
                        }
                        placeholder="TKT-XXXXXXXX"
                        className="min-w-0 flex-1 bg-transparent py-3 pr-3 font-mono uppercase outline-none placeholder:text-(--muted)"
                        />

                        <button
                        type="submit"
                        disabled={
                            validating ||
                            !selectedEventId ||
                            !code.trim()
                        }
                        className="px-3 text-(--accent-green) disabled:opacity-30"
                        >
                        <TicketCheck size={21} />
                        </button>
                    </div>
                    </label>

                    <button
                    type="submit"
                    disabled={
                        validating ||
                        !selectedEventId ||
                        !code.trim()
                    }
                    className="mt-6 w-full bg-(--accent-green) px-5 py-4 text-sm font-semibold text-[#0d0d0d] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                    {validating
                        ? "Validando..."
                        : "Validar código"}
                    </button>
                </form>

                <div className="my-10 flex items-center gap-4">
                    <span className="h-px flex-1 bg-(--border)" />

                    <span className="text-[10px] uppercase tracking-[0.2em] text-(--muted)">
                    ou
                    </span>

                    <span className="h-px flex-1 bg-(--border)" />
                </div>

                <button
                    type="button"
                    disabled={!selectedEventId}
                    className="flex w-full items-center justify-center gap-3 border border-(--border) px-5 py-4 text-sm transition hover:border-(--accent-violet) hover:text-(--accent-violet) disabled:opacity-30"
                >
                    <ScanLine size={19} />
                    Ler QR Code
                </button>

                <p className="mt-4 text-xs leading-5 text-(--muted)">
                    A leitura pela câmera será conectada na
                    próxima parte desta etapa.
                </p>

                {error && (
                    <p className="mt-6 text-sm text-(--error)">
                    {error}
                    </p>
                )}
                </section>

                <section className="min-h-125 border border-(--border) bg-(--surface)">
                <ValidationResult
                    result={result?.result ?? null}
                    ticketCode={result?.ticket?.code}
                    loading={validating}
                />
                </section>
            </div>
            </Container>
        </main>
    );
}

type ValidationResultProps = {
  result: GateValidationResult | null;
  ticketCode?: string;
  loading: boolean;
};

function ValidationResult({
  result,
  ticketCode,
  loading,
}: ValidationResultProps) {
  if (loading) {
    return (
      <div className="flex min-h-125 items-center justify-center p-8 text-center">
        <div>
          <ScanLine
            size={44}
            className="mx-auto animate-pulse text-(--accent-cyan)"
          />

          <p className="mt-5 text-sm text-(--muted)">
            Validando ingresso...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-125 items-center justify-center p-8 text-center">
        <div>
          <ScanLine
            size={48}
            strokeWidth={1.3}
            className="mx-auto text-(--muted)"
          />

          <p className="mt-6 text-sm text-(--muted)">
            Leia um QR Code ou digite o código do
            ingresso.
          </p>
        </div>
      </div>
    );
  }

  if (result === "VALID") {
    return (
      <ResultLayout
        icon={CheckCircle2}
        eyebrow="Ingresso válido"
        title="Entrada liberada."
        description={
          ticketCode
            ? `Código ${ticketCode}`
            : "Ingresso validado com sucesso."
        }
        color="var(--accent-green)"
      />
    );
  }

  if (result === "ALREADY_USED") {
    return (
      <ResultLayout
        icon={ShieldAlert}
        eyebrow="Atenção"
        title="Ingresso já utilizado."
        description="Este ingresso já foi validado anteriormente."
        color="var(--warning)"
      />
    );
  }

  if (result === "WRONG_EVENT") {
    return (
      <ResultLayout
        icon={CircleX}
        eyebrow="Evento incorreto"
        title="Ingresso de outra sessão."
        description="Confira o evento selecionado antes de tentar novamente."
        color="var(--accent-violet)"
      />
    );
  }

  return (
    <ResultLayout
      icon={CircleX}
      eyebrow="Ingresso inválido"
      title="Entrada não autorizada."
      description="O código ou QR Code informado não corresponde a um ingresso válido."
      color="var(--error)"
    />
  );
}

type ResultLayoutProps = {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  description: string;
  color: string;
};

function ResultLayout({
  icon: Icon,
  eyebrow,
  title,
  description,
  color,
}: ResultLayoutProps) {
  return (
    <div
      className="flex min-h-125 items-center p-8 md:p-12"
      style={{
        borderTop: `6px solid ${color}`,
      }}
    >
      <div>
        <Icon
          size={52}
          strokeWidth={1.5}
          style={{ color }}
        />

        <p
          className="mt-10 text-xs uppercase tracking-[0.18em]"
          style={{ color }}
        >
          {eyebrow}
        </p>

        <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-6xl">
          {title}
        </h2>

        <p className="mt-6 max-w-md text-sm leading-6 text-(--muted)">
          {description}
        </p>
      </div>
    </div>
  );
}