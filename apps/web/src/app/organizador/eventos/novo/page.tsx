"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { useAuth } from "@/components/providers/auth-provider";
import { searchMovies } from "@/services/catalog";
import { createEvent } from "@/services/events";
import type { Movie } from "@/types/movie";

export default function NewEventPage() {
  const router = useRouter();

  const {
    user,
    token,
    loading: authLoading,
  } = useAuth();

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] =
    useState<Movie | null>(null);

  const [searching, setSearching] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [room, setRoom] = useState("");
  const [price, setPrice] = useState("");

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

    async function handleSearch(
        event: FormEvent<HTMLFormElement>
        ) {
        event.preventDefault();

        const normalizedQuery = query.trim();

        if (normalizedQuery.length < 2) {
          setError(
          "Digite pelo menos 2 caracteres para buscar."
          );
          return;
        }

         if (!token) {
          setError(
            "Sessão não encontrada. Faça login novamente."
          );
          return;
        }

        try {
          setSearching(true);
          setError("");
          setSelectedMovie(null);

          const data = await searchMovies(
            normalizedQuery,
            token
          );

          setMovies(data);
        } catch (error) {
            setError(
            error instanceof Error
                ? error.message
                : "Não foi possível buscar os filmes"
            );
        } finally {
            setSearching(false);
        }
    }

    async function handleCreateEvent(
        event: FormEvent<HTMLFormElement>
        ) {
        event.preventDefault();

        if (!selectedMovie || !token) {
            return;
        }

        if (
            !date ||
            !time ||
            !location.trim() ||
            !room.trim() ||
            !price
        ) {
            setError(
            "Preencha todos os dados da sessão."
            );
            return;
        }

        const numericPrice = Number(
            price.replace(",", ".")
        );

        if (
            Number.isNaN(numericPrice) ||
            numericPrice <= 0
        ) {
            setError("Informe um preço válido.");
            return;
        }

        try {
          setCreating(true);
          setError("");

          const eventDate = new Date(
            `${date}T${time}:00-03:00`
          );

          await createEvent(
            {
              tmdbMovieId: selectedMovie.id,
              dateTime: eventDate.toISOString(),
              location: location.trim(),
              room: room.trim(),
              price: numericPrice,
            },
            token
          );

          router.push("/organizador");
        } catch (error) {
            setError(
            error instanceof Error
                ? error.message
                : "Não foi possível criar a sessão"
            );
        } finally {
            setCreating(false);
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
                <div className="flex min-h-20 items-center justify-between">
                <button
                    type="button"
                    onClick={() =>
                    router.push("/organizador")
                    }
                    className="flex items-center gap-2 text-sm text-(--muted) transition hover:text-(--foreground)"
                >
                    <ArrowLeft size={16} />
                    Painel
                </button>

                <span className="text-xl font-semibold tracking-[-0.04em]">
                    ELITE
                    <span className="text-(--accent-green)">
                    •
                    </span>
                </span>
                </div>
            </Container>
            </header>

            <section className="border-b border-(--border)">
            <Container className="py-12 md:py-16">
                <p className="text-xs uppercase tracking-[0.18em] text-(--accent-green)">
                Nova sessão
                </p>

                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                Filme escolhido.
                <br />
                Experiência criada.
                </h1>
            </Container>
            </section>

            <Container className="py-12 md:py-16">
            <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">

                {/* PASSO 01 */}

                <section>
                <StepHeader
                    number="01"
                    title="Escolha o filme"
                    active={!selectedMovie}
                />

                <form
                    onSubmit={handleSearch}
                    className="mt-8 flex border-b border-(--border)"
                >
                    <input
                    type="search"
                    value={query}
                    onChange={(event) =>
                        setQuery(event.target.value)
                    }
                    placeholder="Busque por um filme..."
                    className="min-w-0 flex-1 bg-transparent py-4 pr-4 outline-none placeholder:text-(--muted)"
                    />

                    <button
                    type="submit"
                    disabled={searching}
                    aria-label="Buscar filme"
                    className="px-3 text-(--accent-cyan) disabled:opacity-40"
                    >
                    <Search size={21} />
                    </button>
                </form>

                {searching && (
                    <p className="mt-6 text-sm text-(--muted)">
                    Buscando filmes...
                    </p>
                )}

                {!searching &&
                    movies.length > 0 && (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {movies.map((movie) => (
                        <MovieOption
                            key={movie.id}
                            movie={movie}
                            selected={
                            selectedMovie?.id ===
                            movie.id
                            }
                            onSelect={() =>
                            setSelectedMovie(movie)
                            }
                        />
                        ))}
                    </div>
                    )}
                </section>

                {/* PASSO 02 */}

                <section>
                <StepHeader
                    number="02"
                    title="Configure a sessão"
                    active={Boolean(selectedMovie)}
                />

                {!selectedMovie ? (
                    <div className="mt-8 border-y border-(--border) py-14">
                    <p className="max-w-sm text-sm leading-6 text-(--muted)">
                        Selecione um filme para liberar os
                        dados da sessão.
                    </p>
                    </div>
                ) : (
                    <form
                    onSubmit={handleCreateEvent}
                    className="mt-8"
                    >
                    <div className="mb-8 flex gap-4 border-b border-(--border) pb-6">
                        {selectedMovie.posterUrl && (
                        <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-(--surface)">
                            <Image
                            src={selectedMovie.posterUrl}
                            alt={selectedMovie.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            />
                        </div>
                        )}

                        <div>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-(--accent-cyan)">
                            Filme selecionado
                        </span>

                        <h2 className="mt-2 text-xl font-semibold">
                            {selectedMovie.title}
                        </h2>

                        {selectedMovie.releaseDate && (
                            <span className="mt-2 block text-xs text-(--muted)">
                            {selectedMovie.releaseDate.slice(
                                0,
                                4
                            )}
                            </span>
                        )}
                        </div>
                    </div>

                    <div className="grid gap-7 sm:grid-cols-2">
                        <FormField label="Data">
                        <input
                            type="date"
                            value={date}
                            onChange={(event) =>
                            setDate(event.target.value)
                            }
                            required
                            className="form-input"
                        />
                        </FormField>

                        <FormField label="Horário">
                        <input
                            type="time"
                            value={time}
                            onChange={(event) =>
                            setTime(event.target.value)
                            }
                            required
                            className="form-input"
                        />
                        </FormField>

                        <FormField label="Local">
                        <input
                            type="text"
                            value={location}
                            onChange={(event) =>
                            setLocation(event.target.value)
                            }
                            required
                            placeholder="Cine Elite"
                            className="form-input"
                        />
                        </FormField>

                        <FormField label="Sala">
                        <input
                            type="text"
                            value={room}
                            onChange={(event) =>
                            setRoom(event.target.value)
                            }
                            required
                            placeholder="Sala 01"
                            className="form-input"
                        />
                        </FormField>

                        <FormField label="Preço">
                        <div className="flex items-center border-b border-(--border)">
                            <span className="text-sm text-(--muted)">
                            R$
                            </span>

                            <input
                            type="text"
                            inputMode="decimal"
                            value={price}
                            onChange={(event) =>
                                setPrice(
                                event.target.value
                                )
                            }
                            required
                            placeholder="40,00"
                            className="w-full bg-transparent py-3 pl-2 outline-none"
                            />
                        </div>
                        </FormField>
                    </div>

                    {error && (
                        <p className="mt-6 text-sm text-(--error)">
                        {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={creating}
                        className="group mt-10 flex w-full items-center justify-between bg-(--accent-green) px-5 py-4 text-sm font-semibold text-[#0d0d0d] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {creating
                        ? "Criando sessão..."
                        : "Criar sessão"}

                        <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                        />
                    </button>

                    <p className="mt-4 text-xs leading-5 text-(--muted)">
                        A sessão será criada como rascunho.
                        Você poderá publicá-la pelo painel.
                    </p>
                    </form>
                )}
                </section>
            </div>

            {error && !selectedMovie && (
                <p className="mt-8 text-sm text-(--error)">
                {error}
                </p>
            )}
            </Container>
        </main>
    );
}

type StepHeaderProps = {
  number: string;
  title: string;
  active: boolean;
};

function StepHeader({
  number,
  title,
  active,
}: StepHeaderProps) {
  return (
    <div className="flex items-center gap-4 border-b border-(--border) pb-5">
      <span
        className={
          active
            ? "text-xs font-semibold text-(--accent-green)"
            : "text-xs text-(--muted)"
        }
      >
        {number}
      </span>

      <h2
        className={
          active
            ? "text-xl font-semibold"
            : "text-xl font-semibold text-(--muted)"
        }
      >
        {title}
      </h2>

      {!active && number === "01" && (
        <Check
          size={16}
          className="ml-auto text-(--accent-green)"
        />
      )}
    </div>
  );
}

type MovieOptionProps = {
  movie: Movie;
  selected: boolean;
  onSelect: () => void;
};

function MovieOption({
  movie,
  selected,
  onSelect,
}: MovieOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        group
        grid
        grid-cols-[80px_1fr]
        gap-4
        border
        p-3
        text-left
        transition
        ${
          selected
            ? "border-(--accent-cyan) bg-(--surface)"
            : "border-(--border) hover:border-(--muted)"
        }
      `}
    >
      <div className="relative aspect-2/3 w-20 overflow-hidden bg-(--surface)">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-(--muted)">
            Sem imagem
          </div>
        )}
      </div>

      <div className="min-w-0 py-1">
        <h3 className="font-medium leading-5">
          {movie.title}
        </h3>

        {movie.releaseDate && (
          <span className="mt-2 block text-xs text-(--muted)">
            {movie.releaseDate.slice(0, 4)}
          </span>
        )}

        {selected && (
          <span className="mt-4 flex items-center gap-1 text-[10px] uppercase tracking-[0.13em] text-(--accent-cyan)">
            <Check size={12} />
            Selecionado
          </span>
        )}
      </div>
    </button>
  );
}

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

function FormField({
  label,
  children,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.15em] text-(--muted)">
        {label}
      </span>

      {children}
    </label>
  );
}