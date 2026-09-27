import type { ReactNode } from "react";
import { m } from "framer-motion";

interface Props {
  index: string;
  label: string;
  title: ReactNode;
  sub?: string;
}

export default function SectionHead({ index, label, title, sub }: Props) {
  return (
    <m.div
      className="section-head"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="section-no">
        <b>{index}</b> / {label}
      </p>
      <div>
        <h2>{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
    </m.div>
  );
}
