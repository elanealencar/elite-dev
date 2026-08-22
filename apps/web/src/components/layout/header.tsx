import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "./container";

export function Header() {
  return (
    <header className="border-b border-(--border)">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[-0.04em]"
          >
            ELITE<span className="text-(--accent-dark)">•</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link
              href="/"
              className="transition-opacity hover:opacity-50"
            >
              Filmes
            </Link>

            <Link
              href="/meus-ingressos"
              className="transition-opacity hover:opacity-50"
            >
              Meus ingressos
            </Link>
          </nav>

          <Link
            href="/login"
            className="group flex items-center gap-2 border-b border-black pb-1 text-sm font-medium"
          >
            Entrar

            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Container>
    </header>
  );
}