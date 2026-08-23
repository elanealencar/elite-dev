"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { X } from "lucide-react";

type QrScannerProps = {
  onScan: (value: string) => void;
  onClose: () => void;
};

export function QrScanner({
  onScan,
  onClose,
}: QrScannerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-(--border) bg-(--surface) p-5">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-(--accent-violet)">
              Leitor QR
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Aponte para o ingresso.
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar leitor"
            className="text-(--muted) transition hover:text-(--foreground)"
          >
            <X size={21} />
          </button>
        </div>

        <div className="overflow-hidden bg-black">
          <Scanner
            onScan={(detectedCodes) => {
              const value =
                detectedCodes[0]?.rawValue;

              if (value) {
                onScan(value);
              }
            }}
            onError={(error) => {
              console.error(
                "Erro ao ler QR Code:",
                error
              );
            }}
          />
        </div>

        <p className="mt-5 text-xs leading-5 text-(--muted)">
          Centralize o QR Code do ingresso na câmera.
        </p>
      </div>
    </div>
  );
}