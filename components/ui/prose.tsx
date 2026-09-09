import { cn } from "@/lib/utils";

/**
 * Long-form typography. Hand-rolled rather than @tailwindcss/typography: this
 * needs ~20 lines of rules against the site's own tokens, and the plugin would
 * mostly be styles to override.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-muted max-w-[36rem] text-[1.0625rem] leading-[1.75]",
        "[&_h2]:text-text [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold",
        "[&_h3]:text-text [&_h3]:mt-9 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-semibold",
        "[&_p]:my-5",
        "[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_li]:marker:text-faint [&_li]:my-2 [&_li]:pl-1",
        "[&_a]:text-text [&_a]:decoration-line-strong hover:[&_a]:decoration-accent [&_a]:underline [&_a]:underline-offset-4",
        "[&_strong]:text-text [&_strong]:font-semibold",
        "[&_blockquote]:border-accent [&_blockquote]:text-text [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-5",
        "[&_code]:border-line [&_code]:bg-raised [&_code]:text-text [&_code]:rounded [&_code]:border [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
        "[&_pre]:border-line [&_pre]:bg-raised [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:p-5 [&_pre]:text-[0.85rem] [&_pre]:leading-relaxed",
        "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[1em]",
        "[&_hr]:border-line [&_hr]:my-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
