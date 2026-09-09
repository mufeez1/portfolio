import Link from "next/link";
import { site } from "@/data/site";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-line border-t py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-faint font-mono text-[0.6875rem]">
          © {new Date().getFullYear()} {site.name}. Built with Next.js, and measured.
        </p>
        <nav aria-label="Footer">
          <ul className="text-subtle flex items-center gap-6 text-[0.8125rem]">
            <li>
              <Link href="/writing" className="hover:text-text transition-colors">
                Writing
              </Link>
            </li>
            <li>
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text transition-colors"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
