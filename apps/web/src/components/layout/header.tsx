"use client";

import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

import { Container } from "./container";

export function Header() {
  const {
  user,
  logout,
  loading,
} = useAuth();

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
              href="/#em-cartaz"
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

          {!loading && (
            user ? (
              <div className="flex items-center gap-5">
                <span className="hidden text-md text-(--muted) sm:block">
                  {user.name}
                </span>

                <button
                  type="button"
                  onClick={logout}
                  className="group flex items-center gap-2 border-b border-(--foreground) pb-1 text-sm font-medium transition-colors hover:border-(--accent-green) hover:text-(--accent-green)"
                >
                  Sair

                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="group flex items-center gap-2 border-b border-(--foreground) pb-1 text-sm font-medium transition-colors hover:border-(--accent-green) hover:text-(--accent-green)"
              >
                Entrar

                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            )
          )}
        </div>
      </Container>
    </header>
  );
}