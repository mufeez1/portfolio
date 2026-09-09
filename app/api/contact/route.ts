import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
/** Never cached, never prerendered: this route only ever handles POSTs. */
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_000;

/**
 * Best-effort client identity for rate limiting. Trusting a client-controlled
 * header is only acceptable because the consequence of a spoof is a slightly
 * weaker limit on a contact form — never use this shape for authorisation.
 */
function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request): Promise<NextResponse> {
  const key = clientKey(request);
  const limit = rateLimit(key);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  if (request.headers.get("content-type")?.includes("application/json") !== true) {
    return NextResponse.json({ error: "Expected application/json." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    // Field-level messages are safe to return — they are the same rules the
    // client already enforces, and they make the form usable without JS parity.
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Honeypot filled: accept and discard, so the bot sees success and moves on.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  try {
    await deliver(parsed.data);
  } catch (error) {
    // Log server-side with no PII in the message; return an opaque error.
    console.error("[contact] delivery failed", {
      reason: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { error: "Could not send the message right now. Please email me directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

/**
 * Delivery is intentionally pluggable and defaults to a structured log.
 *
 * ponytail: no email provider wired in — that needs an API key this repo must
 * not contain. Set CONTACT_WEBHOOK_URL (Slack, Discord, Resend, anything that
 * accepts a JSON POST) and messages are forwarded; otherwise they are logged.
 */
async function deliver(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    console.info("[contact] message received", {
      name: input.name,
      email: input.email,
      length: input.message.length,
      at: new Date().toISOString(),
    });
    return;
  }

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `New portfolio message from ${input.name} <${input.email}>\n\n${input.message}`,
    }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`webhook responded ${response.status}`);
  }
}
