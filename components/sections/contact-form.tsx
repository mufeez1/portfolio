"use client";

import { useId, useRef, useState } from "react";
import { contactSchema, type ContactField } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<ContactField, string>>;

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const baseId = useId();

  const fieldId = (name: string) => `${baseId}-${name}`;
  const errorId = (name: string) => `${baseId}-${name}-error`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      company: formData.get("company"),
    });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "name" || key === "email" || key === "message") {
          nextErrors[key] ??= issue.message;
        }
      }
      setErrors(nextErrors);
      setStatus("idle");
      // Move focus to the first invalid control so the error is discoverable.
      const firstInvalid = Object.keys(nextErrors)[0];
      if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border-line bg-raised/40 rounded-2xl border p-8 text-center"
      >
        <p className="text-lg font-semibold tracking-tight">Message sent</p>
        <p className="text-muted mt-2 text-[0.9375rem] leading-relaxed">
          Thanks for reaching out — I read everything and usually reply within a day or
          two.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-subtle decoration-line-strong hover:text-text mt-6 text-sm underline underline-offset-4 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot: off-screen rather than display:none, so bots still fill it. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={fieldId("company")}>Company (leave blank)</label>
        <input
          id={fieldId("company")}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={fieldId(field.name)}
              className="text-text block text-sm font-medium"
            >
              {field.label}
            </label>
            <input
              id={fieldId(field.name)}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              aria-invalid={errors[field.name] ? true : undefined}
              aria-describedby={errors[field.name] ? errorId(field.name) : undefined}
              className={cn(
                "bg-canvas mt-2 h-11 w-full rounded-lg border px-3.5 text-[0.9375rem]",
                "placeholder:text-faint transition-colors",
                errors[field.name] ? "border-red-500" : "border-line-strong",
              )}
            />
            {errors[field.name] ? (
              <p id={errorId(field.name)} className="mt-2 text-sm text-red-500">
                {errors[field.name]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div>
        <label
          htmlFor={fieldId("message")}
          className="text-text block text-sm font-medium"
        >
          Message
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={5}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className={cn(
            "bg-canvas mt-2 w-full resize-y rounded-lg border px-3.5 py-3 text-[0.9375rem]",
            "placeholder:text-faint transition-colors",
            errors.message ? "border-red-500" : "border-line-strong",
          )}
        />
        {errors.message ? (
          <p id={errorId("message")} className="mt-2 text-sm text-red-500">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 animate-spin"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 3a9 9 0 1 0 9 9" />
              </svg>
              Sending
            </>
          ) : (
            "Send message"
          )}
        </Button>

        {/* Assertive: a submit failure needs to interrupt, unlike field hints. */}
        <p role="alert" className="text-sm text-red-500">
          {formError}
        </p>
      </div>
    </form>
  );
}
