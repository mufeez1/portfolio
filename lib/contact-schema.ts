import { z } from "zod";

/**
 * Shared between the client form and the route handler so validation rules
 * cannot drift. The server re-validates regardless: the client copy is a UX
 * affordance, never a trust boundary.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(160),
  message: z
    .string()
    .trim()
    .min(20, "Please give me a little more detail (20 characters or more).")
    .max(4000, "Please keep the message under 4000 characters."),
  /** Honeypot — must stay empty. Bots fill it, humans never see it. */
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof Omit<ContactInput, "company">;
