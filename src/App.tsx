import { useCallback, useState } from "react";
import GridBackground from "./components/GridBackground";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import OpenSource from "./components/OpenSource";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  return (
    <>
      <GridBackground />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav onOpenPalette={openPalette} />

      <main id="main">
        <Hero />
        <Experience />
        <Projects />
        <OpenSource />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer onOpenPalette={openPalette} />

      <CommandPalette open={paletteOpen} onOpen={openPalette} onClose={closePalette} />
    </>
  );
}
