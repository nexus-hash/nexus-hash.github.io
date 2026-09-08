import { motion } from "framer-motion";

interface Props {
  index: string;
  title: string;
  sub?: string;
}

export default function SectionHead({ index, title, sub }: Props) {
  return (
    <motion.div
      className="section-head"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="section-index">{`// ${index}`}</p>
      <h2>{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </motion.div>
  );
}
