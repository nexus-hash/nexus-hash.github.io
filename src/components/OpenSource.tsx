import { m } from "framer-motion";
import { ArrowUpRight, GitMerge, GitPullRequestArrow, GitPullRequestDraft, Star } from "lucide-react";
import { openSource, openSourceSearchUrl } from "../data/resume";
import { useCardGlow } from "../hooks/useCardGlow";
import SectionHead from "./SectionHead";

const STATUS = {
  merged: { label: "MERGED", Icon: GitMerge },
  open: { label: "OPEN", Icon: GitPullRequestArrow },
  "in-progress": { label: "IN PROGRESS", Icon: GitPullRequestDraft },
} as const;

/** Split off the last word so the external-link icon can be glued to it and never wraps alone. */
function titleHead(t: string) {
  const i = t.lastIndexOf(" ");
  return i === -1 ? "" : t.slice(0, i + 1);
}
function titleTail(t: string) {
  const i = t.lastIndexOf(" ");
  return i === -1 ? t : t.slice(i + 1);
}

function DiffBar({ add, del }: { add: number; del: number }) {
  const total = add + del || 1;
  return (
    <span className="oss-diff" title={`+${add} −${del}`}>
      <span className="oss-diff-add">+{add}</span>
      <span className="oss-diff-del">−{del}</span>
      <span className="oss-diff-bar" aria-hidden="true">
        <span style={{ flex: add / total }} className="is-add" />
        <span style={{ flex: del / total }} className="is-del" />
      </span>
    </span>
  );
}

export default function OpenSource() {
  const glow = useCardGlow();
  const merged = openSource.filter((c) => c.status === "merged").length;
  const repos = new Set(openSource.map((c) => c.repo)).size;

  return (
    <section className="section open-source" id="open-source">
      <SectionHead index="03" title="Open source" sub="Fixing the tools I actually use, upstream." />

      <m.div
        className="oss-panel glow"
        onPointerMove={glow}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="project-panel-bar">
          <span />
          <span />
          <span />
          <span className="project-panel-bar-label">$ gh pr list --author nexus-hash</span>
          <span className="oss-bar-count">
            {openSource.length} results · {merged} merged · {repos} repos
          </span>
        </div>

        <ol className="oss-list">
          {openSource.map((c, i) => {
            const { label, Icon } = STATUS[c.status];
            return (
              <m.li
                key={`${c.repo}#${c.number}`}
                className="oss-row"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={`oss-status is-${c.status}`}>
                  <Icon size={13} aria-hidden="true" />
                  {label}
                </span>

                <div className="oss-body">
                  <div className="oss-meta">
                    <a className="oss-repo" href={`https://github.com/${c.repo}`} target="_blank" rel="noopener noreferrer">
                      {c.repo}
                    </a>
                    <span className="oss-stars">
                      <Star size={11} aria-hidden="true" />
                      {c.stars}
                    </span>
                    <span className="oss-lang">{c.language}</span>
                    <span className="oss-date">
                      #{c.number} · {c.date}
                    </span>
                  </div>

                  <h3 className="oss-title">
                    <a href={c.url} target="_blank" rel="noopener noreferrer">
                      {titleHead(c.title)}
                      <span className="oss-title-tail">
                        {titleTail(c.title)}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </a>
                  </h3>
                  <p className="oss-summary">{c.summary}</p>

                  <div className="oss-foot">
                    {c.diff && <DiffBar add={c.diff.add} del={c.diff.del} />}
                    {c.issue && (
                      <a className="oss-issue" href={c.issue.url} target="_blank" rel="noopener noreferrer">
                        {c.status === "merged" ? "closes" : "refs"} #{c.issue.number}
                      </a>
                    )}
                  </div>
                </div>
              </m.li>
            );
          })}
        </ol>

        <div className="oss-panel-foot">
          <a href={openSourceSearchUrl} target="_blank" rel="noopener noreferrer">
            $ gh search prs --author nexus-hash <span>--all</span> <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </m.div>
    </section>
  );
}
