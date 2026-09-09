import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-28">
      <p className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
        404
      </p>
      <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.03em]">
        This page does not exist
      </h1>
      <p className="text-muted mt-5 max-w-md text-lg leading-relaxed">
        The link may be out of date, or the page may have moved.
      </p>
      <Link
        href="/"
        className="text-text decoration-line-strong hover:decoration-accent mt-8 inline-flex w-fit items-center gap-1.5 text-sm font-medium underline underline-offset-4 transition-colors"
      >
        Back to the homepage
        <span aria-hidden="true">→</span>
      </Link>
    </Container>
  );
}
