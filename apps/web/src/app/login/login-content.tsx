"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { loginRequest } from "@/services/auth";
import { useAuth } from "@/components/providers/auth-provider";

import { useSearchParams } from "next/navigation";

export function LoginContent() {
  const router = useRouter();

  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginRequest({
        email,
        password,
      });

      setSession(data);

      if (data.user.role === "ORGANIZER") {
        router.push("/organizador");
        return;
      }

      if (data.user.role === "GATE") {
        router.push("/portaria");
        return;
      }

      router.push(
        redirect && redirect.startsWith("/")
          ? redirect
          : "/"
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível entrar"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-(--background)">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex flex-col justify-between border-b border-(--border) p-8 lg:border-b-0 lg:border-r">
          <div>
            <span className="text-xl font-semibold tracking-[-0.04em]">
              ELITE
              <span className="text-(--accent-green)">
                •
              </span>
            </span>
          </div>

          <div className="my-20 max-w-xl lg:my-0">
            <p className="text-xs uppercase tracking-[0.18em] text-(--accent-violet)">
              Acesso
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-6xl">
              Entre.
              <br />
              Seu lugar
              <br />
              está aqui.
            </h1>
          </div>

          <div className="flex gap-2">
            <span className="h-1 w-10 bg-(--accent-green)" />
            <span className="h-1 w-10 bg-(--accent-cyan)" />
            <span className="h-1 w-10 bg-(--accent-violet)" />
          </div>
        </section>

        <section className="flex items-center justify-center p-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-(--muted)">
              Login
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">
              Acesse sua conta
            </h2>

            <div className="mt-10 space-y-7">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-(--muted)">
                  E-mail
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  className="
                    mt-3
                    w-full
                    border-b
                    border-(--border)
                    bg-transparent
                    py-3
                    outline-none
                    transition-colors
                    focus:border-(--accent-cyan)
                  "
                  placeholder="seu@email.com"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-(--muted)">
                  Senha
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  className="
                    mt-3
                    w-full
                    border-b
                    border-(--border)
                    bg-transparent
                    py-3
                    outline-none
                    transition-colors
                    focus:border-(--accent-cyan)
                  "
                  placeholder="••••••••"
                />
              </label>
            </div>

            {error && (
              <p className="mt-6 text-sm text-(--error)">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                mt-10
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
              {loading
                ? "Entrando..."
                : "Entrar"}

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}