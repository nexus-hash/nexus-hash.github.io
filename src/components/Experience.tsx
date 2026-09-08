import { useEffect, useState } from "react";
import { LayoutGroup } from "framer-motion";
import { experience } from "../data/resume";
import ExperienceCard from "./ExperienceCard";
import SectionHead from "./SectionHead";

export default function Experience() {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 640;
    document.body.classList.toggle("card-lock", Boolean(openId) && isMobile);
    return () => document.body.classList.remove("card-lock");
  }, [openId]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section className="section experience" id="experience">
      <SectionHead
        index="01"
        title="Experience"
        sub="Three years building the systems that settle billions of transactions."
      />

      <LayoutGroup>
        <div className="exp-list">
          {experience.map((entry) => (
            <ExperienceCard
              key={entry.id}
              entry={entry}
              isOpen={openId === entry.id}
              onToggle={() => setOpenId((current) => (current === entry.id ? null : entry.id))}
            />
          ))}
        </div>
      </LayoutGroup>
    </section>
  );
}
