import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t border-(--border) bg-[#151515]">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-(--muted)">
              Elite Tickets / 2026
            </p>

            <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-6xl">
              Seu lugar
              <br />
              está esperando.
            </h2>

            <div className="mt-8 flex gap-2">
              <span className="h-1 w-10 bg-(--accent-green)" />
              <span className="h-1 w-10 bg-(--accent-cyan)" />
              <span className="h-1 w-10 bg-(--accent-violet)" />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-12 md:items-end">
            <nav className="flex flex-col gap-3 text-right text-sm">
              <Link
                href="/"
                className="transition-colors hover:text-(--accent-green)"
              >
                Filmes
              </Link>

              <Link
                href="/meus-ingressos"
                className="transition-colors hover:text-(--accent-cyan)"
              >
                Meus ingressos
              </Link>

              <Link
                href="/login"
                className="group flex items-center justify-end gap-2 transition-colors hover:text-(--accent-violet)"
              >
                Entrar
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </nav>

            <p className="max-w-xs text-right text-xs leading-5 text-(--muted)">
              Projeto Full Stack desenvolvido para o processo seletivo
              Elite Dev - Verzel.
            </p>
            <p className="max-w-xs text-right text-xs leading-5 text-(--muted)">
              Desenvolvido por <span className="text-(--accent-green)">Elane Alencar</span> <a href="https://linkedin.com/in/elanealencar/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                https://linkedin.com/in/elanelencar
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-(--border) py-6">
          <span className="text-lg font-semibold tracking-[-0.04em]">
            ELITE TICKETS   <span className="text-(--accent-green) text-2xl">•</span>
          </span>

          <span className="text-xs text-(--muted)">
            © 2026
          </span>
        </div>
      </Container>
    </footer>
  );
}