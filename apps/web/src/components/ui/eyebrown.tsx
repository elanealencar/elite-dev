type EyebrowProps = {
  children: React.ReactNode;
};

export function Eyebrow({ children }: EyebrowProps) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]">
      <span className="h-2 w-2 bg-(--accent)" />

      {children}
    </div>
  );
}