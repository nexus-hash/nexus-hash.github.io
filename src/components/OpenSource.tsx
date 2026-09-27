import { m } from "framer-motion";
import { ArrowUpRight, GitMerge, GitPullRequestArrow, GitPullRequestDraft, Star } from "lucide-react";
import { openSource, openSourceSearchUrl } from "../data/resume";
import SectionHead from "./SectionHead";

const STATUS = {
  merged: { label: "Merged", Icon: GitMerge },
  open: { label: "In review", Icon: GitPullRequestArrow },
  "in-progress": { label: "In progress", Icon: GitPullRequestDraft },
} as const;

/** Split off the last word so the link icon is glued to it and never wraps alone. */
function splitTitle(t: string): [string, string] {
  const i = t.lastIndexOf(" ");
  return i === -1 ? ["", t] : [t.slice(0, i + 1), t.slice(i + 1)];
}

export default function OpenSource() {
  const merged = openSource.filter((c) => c.status === "merged").length;
  const repos = new Set(openSource.map((c) => c.repo)).size;

  return (
    <section className="section" id="open-source">
      <div className="wrap">
        <SectionHead
          index="03"
          label="Open source"
          title={
            <>
              Fixing the tools I use, <em>upstream</em>.
            </>
          }
          sub="Bugs I hit, root-caused and sent back to the projects they came from."
        />

        <div className="os">
          <div className="os-head" aria-hidden="true">
            <span>Status</span>
            <span>Change</span>
            <span>Diff</span>
            <span>Date</span>
          </div>

          <ol>
            {openSource.map((c, i) => {
              const { label, Icon } = STATUS[c.status];
              const [head, tail] = splitTitle(c.title);
              const total = (c.diff?.add ?? 0) + (c.diff?.del ?? 0) || 1;
              return (
                <m.li
                  className="os-row"
                  key={`${c.repo}#${c.number}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-6% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className={`os-status is-${c.status}`}>
                    <Icon size={13} aria-hidden="true" />
                    {label}
                  </span>

                  <div className="os-main">
                    <p className="os-repo">
                      <a href={`https://github.com/${c.repo}`} target="_blank" rel="noopener noreferrer">
                        {c.repo}
                      </a>
                      <span>
                        <Star size={11} aria-hidden="true" />
                        {c.stars}
                      </span>
                      <span>{c.language}</span>
                      <span>#{c.number}</span>
                    </p>
                    <h3 className="os-title">
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        {head}
                        <span className="os-title-tail">
                          {tail}
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </span>
                      </a>
                    </h3>
                    <p className="os-summary">{c.summary}</p>
                    {c.issue && (
                      <a className="os-issue" href={c.issue.url} target="_blank" rel="noopener noreferrer">
                        {c.status === "merged" ? "closes" : "refs"} #{c.issue.number}
                      </a>
                    )}
                  </div>

                  <div className="os-diff">
                    {c.diff && (
                      <>
                        <span>
                          <span className="add">+{c.diff.add}</span>
                          <span className="del">−{c.diff.del}</span>
                        </span>
                        <span className="os-diff-bar" aria-hidden="true">
                          <span className="add" style={{ flex: c.diff.add / total }} />
                          <span className="del" style={{ flex: c.diff.del / total }} />
                        </span>
                      </>
                    )}
                  </div>

                  <p className="os-date">{c.date}</p>
                </m.li>
              );
            })}
          </ol>

          <div className="os-foot">
            <span className="mono">
              {openSource.length} entries · {merged} merged · {repos} repositories
            </span>
            <a className="link" href={openSourceSearchUrl} target="_blank" rel="noopener noreferrer">
              Every pull request on GitHub <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
