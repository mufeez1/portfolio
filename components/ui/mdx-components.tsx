import type { MDXComponents } from "mdx/types";

/**
 * Overrides for elements MDX generates that need more than styling.
 *
 * Code blocks scroll horizontally on narrow viewports, which makes them a
 * scrollable region a keyboard user cannot reach. tabIndex plus a named role
 * is the accessible fix (WCAG 2.1.1); the Prose component handles the visuals.
 */
export const mdxComponents: MDXComponents = {
  pre: ({ children, ...props }) => (
    <pre tabIndex={0} role="region" aria-label="Code sample" {...props}>
      {children}
    </pre>
  ),
  a: ({ href, children, ...props }) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
};
