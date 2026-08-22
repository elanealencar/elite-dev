"use client";

import { useEffect, useState } from "react";
import {
  Armchair,
  Film,
  QrCode,
} from "lucide-react";

import { Container } from "@/components/layout/container";

const steps = [
  {
    number: "01",
    label: "ESCOLHA",
    title: "O filme.",
    description:
      "Explore as sessões disponíveis e encontre o filme que combina com o seu momento.",
    color: "#9FE870",
    icon: Film,
  },
  {
    number: "02",
    label: "RESERVE",
    title: "Seu lugar.",
    description:
      "Veja os assentos disponíveis e escolha exatamente onde você quer assistir.",
    color: "#0AE1FF",
    icon: Armchair,
  },
  {
    number: "03",
    label: "APRESENTE",
    title: "Seu ingresso.",
    description:
      "Receba seu ingresso digital e use o QR Code para entrar na sessão.",
    color: "#7D72FF",
    icon: QrCode,
  },
];

export function Journey() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) =>
        current === steps.length - 1 ? 0 : current + 1
      );
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  const active = steps[activeStep];
  const Icon = active.icon;

  return (
    <section className="border-b border-(--border)">
      <Container className="py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-[0.45fr_1fr]">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-(--muted)">
                Sua experiência
              </p>

              <p className="mt-4 max-w-xs text-sm leading-6 text-(--muted)">
                Do primeiro clique até a entrada na sala.
              </p>
            </div>

            <div className="mt-12 hidden lg:block">
              <span
                className="block h-3 w-3 transition-colors duration-500"
                style={{ backgroundColor: active.color }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between border-b border-(--border) pb-8">
              <span
                className="text-sm font-medium transition-colors duration-500"
                style={{ color: active.color }}
              >
                {active.number} / 03
              </span>

              <Icon
                size={30}
                strokeWidth={1.5}
                style={{ color: active.color }}
                className="transition-colors duration-500"
              />
            </div>

            <div className="min-h-65 py-10 md:min-h-80">
              <p
                className="text-sm font-medium uppercase tracking-[0.18em] transition-colors duration-500"
                style={{ color: active.color }}
              >
                {active.label}
              </p>

              <h2 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-7xl">
                {active.title}
              </h2>

              <p className="mt-8 max-w-xl text-base leading-7 text-(--muted) md:text-lg">
                {active.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className="group py-4 text-left"
                  aria-label={`Ir para etapa ${step.number}`}
                >
                  <span
                    className="block h-0.5 w-full transition-colors duration-500"
                    style={{
                      backgroundColor:
                        activeStep === index
                          ? step.color
                          : "#292929",
                    }}
                  />

                  <span
                    className="mt-3 block text-xs transition-colors"
                    style={{
                      color:
                        activeStep === index
                          ? step.color
                          : "#9A9A94",
                    }}
                  >
                    {step.number}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}