import { m } from "framer-motion";
import { ArrowUpRight, GitMerge, GitPullRequestArrow, Star } from "lucide-react";
import oss from "../data/oss.json";
import { openSourceSearchUrl } from "../data/resume";
import SectionHead from "./SectionHead";

const stars = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The project's pull request list on GitHub, filtered to this author. */
const pulls = (repo: string, extra = "") =>
  `https://github.com/${repo}/pulls?q=${encodeURIComponent(`is:pr author:${oss.author}${extra}`)}`;

export default function OpenSource() {
  // Only projects that have accepted a change are listed. The rest still count as opened.
  const shown = oss.projects.filter((p) => p.merged > 0);
  const opened = oss.projects.reduce((n, p) => n + p.opened, 0);
  const merged = oss.projects.reduce((n, p) => n + p.merged, 0);

  return (
    <section className="section" id="open-source">
      <div className="wrap">
        <SectionHead
          index="03"
          label="Open source"
          title={
            <>
              Giving back to the <em>community</em>.
            </>
          }
          sub="Fixes and improvements to open source projects. I do it because I enjoy the work."
        />

        <div className="os">
          <dl className="os-totals">
            <div>
              <dt>Pull requests opened</dt>
              <dd>{opened}</dd>
            </div>
            <div>
              <dt>Merged</dt>
              <dd>{merged}</dd>
            </div>
            <div>
              <dt>Projects merged into</dt>
              <dd>{shown.length}</dd>
            </div>
          </dl>

          <ol className="os-list">
            {shown.map((p, i) => (
              <m.li
                className="os-row"
                key={p.repo}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6% 0px" }}
                transition={{ duration: 0.55, delay: Math.min(i, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  className="os-icon"
                  src={`${import.meta.env.BASE_URL}${p.icon}`}
                  alt=""
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                />

                <div className="os-main">
                  <h3 className="os-name">
                    <a href={`https://github.com/${p.repo}`} target="_blank" rel="noopener noreferrer">
                      {p.repo}
                    </a>
                  </h3>
                  {p.description && <p className="os-summary">{p.description}</p>}
                  <p className="os-meta">
                    {p.language && <span>{p.language}</span>}
                    <span>
                      <Star size={11} aria-hidden="true" />
                      {stars.format(p.stars)}
                    </span>
                  </p>
                </div>

                <div className="os-counts">
                  <a
                    className="os-count is-merged"
                    href={pulls(p.repo, " is:merged")}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${plural(p.merged, "merged pull request", "merged pull requests")} in ${p.repo}, on GitHub`}
                  >
                    <GitMerge size={14} aria-hidden="true" />
                    <b>{p.merged}</b> merged
                  </a>
                  <a
                    className="os-count"
                    href={pulls(p.repo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${plural(p.opened, "pull request", "pull requests")} opened in ${p.repo}, on GitHub`}
                  >
                    <GitPullRequestArrow size={14} aria-hidden="true" />
                    <b>{p.opened}</b> opened
                  </a>
                </div>
              </m.li>
            ))}
          </ol>

          <div className="os-foot">
            <a className="link" href={openSourceSearchUrl} target="_blank" rel="noopener noreferrer">
              Every pull request on GitHub <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
