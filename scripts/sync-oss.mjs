// Refreshes src/data/oss.json and the project icons in public/oss from GitHub.
// Run with `npm run sync:oss`. The weekly sync workflow runs it and opens a pull
// request when the contributions changed.
// If GitHub cannot be reached, the committed data is left as it is.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AUTHOR = "nexus-hash";
/** Repositories below this star count are treated as personal or team repos, not open source projects. */
const MIN_STARS = 10;
/** "owner/name" entries to force in or out, whatever their star count. */
const INCLUDE = [];
const EXCLUDE = [];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-sync",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

async function allPulls() {
  const items = [];
  for (let page = 1; page <= 10; page++) {
    const q = encodeURIComponent(`is:pr author:${AUTHOR} -user:${AUTHOR}`);
    const data = await api(`/search/issues?q=${q}&per_page=100&page=${page}`);
    items.push(...data.items);
    if (items.length >= data.total_count || data.items.length === 0) break;
  }
  return items;
}

function describe(info) {
  return {
    repo: info.full_name,
    name: info.name,
    description: info.description ?? "",
    language: info.language ?? "",
    stars: info.stargazers_count,
  };
}

async function main() {
  const byRepo = new Map();
  for (const pr of await allPulls()) {
    const repo = pr.repository_url.split("/repos/")[1];
    const entry = byRepo.get(repo) ?? { opened: 0, merged: 0, lastMerged: null };
    entry.opened += 1;
    const mergedAt = pr.pull_request?.merged_at;
    if (mergedAt) {
      entry.merged += 1;
      if (!entry.lastMerged || mergedAt > entry.lastMerged) entry.lastMerged = mergedAt;
    }
    byRepo.set(repo, entry);
  }

  const projects = [];
  for (const [repo, counts] of byRepo) {
    if (EXCLUDE.includes(repo)) continue;
    const info = await api(`/repos/${repo}`);
    if (info.stargazers_count < MIN_STARS && !INCLUDE.includes(repo)) continue;

    const owner = info.owner.login;
    const icon = `oss/${owner.toLowerCase()}.png`;
    if (counts.merged === 0) {
      projects.push({ ...describe(info), icon, ...counts });
      continue;
    }
    const img = await fetch(`${info.owner.avatar_url}&s=128`);
    if (!img.ok) throw new Error(`${img.status} for the ${owner} icon`);
    const file = resolve(root, "public", icon);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, Buffer.from(await img.arrayBuffer()));

    projects.push({ ...describe(info), icon, ...counts });
  }

  projects.sort((a, b) => b.merged - a.merged || b.stars - a.stars);
  const out = { author: AUTHOR, projects };
  await writeFile(resolve(root, "src/data/oss.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(`oss: ${projects.length} projects, ${projects.reduce((n, p) => n + p.opened, 0)} pull requests`);
}

main().catch((err) => {
  console.warn(`oss: keeping the committed data (${err.message})`);
});
