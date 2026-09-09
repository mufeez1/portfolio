"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary. Logs the digest rather than the raw error: the
 * digest is what correlates with the server log, and the message may contain
 * details that should not reach a browser console.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error.digest ?? "no-digest");
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-28">
      <p className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
        Error
      </p>
      <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.03em]">
        Something went wrong
      </h1>
      <p className="text-muted mt-5 max-w-md text-lg leading-relaxed">
        This one is on me. Try again — if it keeps happening, the contact form still
        works.
      </p>
      <div className="mt-8">
        <Button onClick={reset}>Try again</Button>
      </div>
    </Container>
  );
}
