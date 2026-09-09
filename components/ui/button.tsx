import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[background-color,border-color,color,opacity] duration-200 " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-text text-canvas hover:opacity-88 border border-transparent",
  secondary: "border border-line-strong text-text hover:bg-raised hover:border-text/25",
  ghost: "text-muted hover:text-text",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = CommonProps & {
  href: string;
  external?: boolean;
  download?: boolean | string;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

/** Anchor styled as a button. Separate component so the DOM element is honest. */
export function ButtonLink({
  href,
  external,
  download,
  variant = "primary",
  size = "md",
  className,
  children,
}: AnchorProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external || download) {
    return (
      <a
        href={href}
        className={classes}
        {...(download ? { download } : {})}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
