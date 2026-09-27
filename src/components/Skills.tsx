import { m } from "framer-motion";
import { skills } from "../data/resume";
import SectionHead from "./SectionHead";

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <SectionHead
          index="04"
          label="Skills"
          title={
            <>
              The <em>stack</em> behind it.
            </>
          }
          sub="Large type is what I reach for daily. The chips are what I have shipped with."
        />

        <div className="manifest">
          {skills.map((cluster, i) => (
            <m.div
              className="manifest-row"
              key={cluster.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="manifest-key">{cluster.title}</p>
              <div>
                <p className="manifest-core">
                  {cluster.core.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </p>
                {cluster.extra && cluster.extra.length > 0 && (
                  <ul className="manifest-extra" aria-label={`More ${cluster.title}`}>
                    {cluster.extra.map((s) => (
                      <li className="chip" key={s}>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
