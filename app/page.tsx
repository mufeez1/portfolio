import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Architecture } from "@/components/sections/architecture";
import { Writing } from "@/components/sections/writing";
import { Contact } from "@/components/sections/contact";
import { Container } from "@/components/ui/container";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Container>
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Architecture />
        <Writing />
        <Contact />
      </Container>
    </>
  );
}
