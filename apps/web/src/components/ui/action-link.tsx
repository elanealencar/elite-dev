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
        bg-(--foreground)
        px-6
        py-4
        text-sm
        font-medium
        text-(--background)
        transition-colors
        hover:bg-(--accent)
        hover:text-(--foreground)
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