import { useCallback, useState } from "react";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import Trace from "./components/Trace";
import Projects from "./components/Projects";
import OpenSource from "./components/OpenSource";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import TrainRail from "./components/TrainRail";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const [theme, toggleTheme] = useTheme();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <TopBar theme={theme} onToggleTheme={toggleTheme} onOpenPalette={openPalette} />

      <main id="main">
        <Hero />
        <Trace />
        <Projects />
        <OpenSource />
        <Skills />
        <Contact />
      </main>

      <Footer onOpenPalette={openPalette} />

      <TrainRail />

      <CommandPalette
        open={paletteOpen}
        onOpen={openPalette}
        onClose={closePalette}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </>
  );
}
