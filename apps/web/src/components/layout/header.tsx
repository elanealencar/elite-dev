import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "./container";

export function Header() {
  return (
    <header className="border-b border-(--border) bg-[#151515]">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[-0.04em]"
          >
            ELITE TICKETS   <span className="text-(--accent-green) text-2xl">•</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link
              href="/"
              className="hover:text-(--accent-green)"
            >
              FILMES
            </Link>

            <Link
              href="/meus-ingressos"
              className="hover:text-(--accent-green)"
            >
              MEUS INGRESSOS
            </Link>
          </nav>

          <Link
            href="/login"
            className="group flex items-center gap-2 pb-1 text-sm font-medium transition-colors hover:border-(--accent-green) hover:text-(--accent-green) border-2 border-white rounded-3xl px-6 py-2"
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