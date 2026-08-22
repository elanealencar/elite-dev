import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ActionLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function ActionLink({
  href,
  children,
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className="
        group
        inline-flex
        items-center
        gap-5
        bg-(--accent-green)
        px-6
        py-4
        text-sm
        font-medium
        text-[#111111]
        transition-colors
        hover:bg-[#f4f4ee]
      "
    >
      {children}

      <ArrowRight
        size={18}
        className="transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}