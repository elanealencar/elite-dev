import { Container } from "@/components/layout/container";
import { ActionLink } from "@/components/ui/action-link";
import { Eyebrow } from "@/components/ui/eyebrow";

export function Hero() {
  return (
    <section className="border-b border-(--border)">
      <Container className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <Eyebrow>Elite Cinema / Sessões 2026</Eyebrow>

             <div className="ml-4 mt-2 flex gap-2">
              <span className="h-0.5 w-12 bg-(--accent-green)" />
              <span className="h-0.5 w-12 bg-(--accent-cyan)" />
              <span className="h-0.5 w-12 bg-(--accent-violet)" />
            </div>

            <h1 className="mt-8 max-w-5xl text-[clamp(3.25rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
              A sua próxima
              <br />
              sessão
              <br />
              começa aqui.
            </h1>
          </div>

          <div className="max-w-sm lg:pb-3">
            <p className="text-lg leading-7 text-(--muted)">
              Escolha o filme, encontre seu lugar e garanta seu ingresso
              em poucos passos.
            </p>

            <div className="mt-8">
              <ActionLink href="#em-cartaz">
                Ver sessões
              </ActionLink>
            </div>
            
          </div>
        </div>
      </Container>
    </section>
  );
}