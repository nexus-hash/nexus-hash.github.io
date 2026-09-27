export interface ExperienceRole {
  title: string;
  stack: string;
  dates?: string;
  bullets: string[];
}

export interface ExperienceEntry {
  id: string;
  company: string;
  headlineRole: string;
  dates: string;
  metricValue?: string;
  metricLabel: string;
  hint: string;
  anchor?: boolean;
  roles: ExperienceRole[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "visa",
    company: "Visa",
    headlineRole: "Senior Software Engineer",
    dates: "2023 — Present",
    metricValue: "10x",
    metricLabel: "settlement acceleration",
    hint: "Payment infrastructure & agentic AI",
    anchor: true,
    roles: [
      {
        title: "Senior Software Engineer",
        stack: "Vert.x · Spring · Python · Kafka",
        dates: "Jul 2025 — Present",
        bullets: [
          "Contributed to an AI triage and RCA pipeline processing 1M+ logs/sec, drastically cutting production incident MTTR.",
          "Designed and built a distributed, developer-facing RAG platform with hybrid search, reducing org-wide token spend by 15%.",
          "Migrated Visa's 2 largest payment gateways to multithreaded microservices, accelerating settlement by 10x.",
          "Automated multi-tier security vulnerability remediation across 100+ repositories using agentic AI workflows with minimal developer overhead.",
        ],
      },
      {
        title: "Software Engineer",
        stack: "Vert.x · Spring · Kafka · SQL",
        dates: "Jun 2023 — Jun 2025",
        bullets: [
          "Worked on the PACE agentic platform, automating 20% of org-wide Jira issues to boost developer throughput.",
          "Built and ran a Claude Code agent integrated into GitHub workflows for documentation generation across 100+ repositories, saving 450 engineering days.",
          "Built a payment event processing system from scratch handling 100M+ batch events/day across 50K+ merchants.",
          "Contributed to a TPS scaling initiative, achieving a 24x performance gain in transaction processing efficiency.",
        ],
      },
      {
        title: "Software Development Intern",
        stack: "Java · Vert.x · SQL",
        dates: "Jan 2023 — Jun 2023",
        bullets: [
          "Developed an on-demand settlement generation API that decoupled Visa support workflows from engineering, cutting delivery time for custom requests.",
        ],
      },
    ],
  },
  {
    id: "adaptivecode",
    company: "Adaptivecode.io",
    headlineRole: "Backend Engineer",
    dates: "Sep — Dec 2022",
    metricValue: "35",
    metricLabel: "services orchestrated",
    hint: "TypeScript · Kubernetes",
    roles: [
      {
        title: "Backend Engineer",
        stack: "TypeScript · Kubernetes",
        bullets: [
          "Modernized service infrastructure by orchestrating 35 services on Kubernetes.",
          "Refactored 5 services to TypeScript for enhanced type safety and scale.",
        ],
      },
    ],
  },
  {
    id: "mable",
    company: "Mable",
    headlineRole: "Backend Engineer Intern",
    dates: "Jul — Aug 2022",
    metricLabel: "ML-driven recommendation APIs",
    hint: "Go · AWS · SQL",
    roles: [
      {
        title: "Backend Engineer Intern",
        stack: "Go · AWS · SQL",
        bullets: [
          "Engineered scalable asset metadata and ML-driven recommendation APIs for the Mable platform, powering high-throughput retrieval and real-time user personalization.",
        ],
      },
    ],
  },
  {
    id: "onelab",
    company: "One-lab Ventures",
    headlineRole: "Full Stack Developer Intern",
    dates: "Jan — Jun 2022",
    metricValue: "200K+",
    metricLabel: "users served",
    hint: "React · Node.js · AWS · MongoDB",
    roles: [
      {
        title: "Full Stack Developer Intern",
        stack: "React · Node.js · AWS · MongoDB",
        bullets: [
          "Led end-to-end development of scalable EdTech and custom web platforms across diverse client engagements, directly serving 200K+ users.",
        ],
      },
    ],
  },
];

export interface SkillCluster {
  title: string;
  core: string[];
  extra?: string[];
}

export const skills: SkillCluster[] = [
  {
    title: "Languages & core",
    core: ["Java", "Go", "Python"],
    extra: ["TypeScript", "JavaScript", "Shell Scripting", "SQL"],
  },
  {
    title: "Backend & systems",
    core: ["Vert.x", "Spring Boot", "Apache Kafka"],
    extra: ["Node.js", "ReactJS", "Apache Flume", "PostgreSQL", "MongoDB"],
  },
  {
    title: "GenAI & agentic",
    core: ["Claude Code Plugins", "RAG Architectures", "Multi-Stage AI Pipelines"],
  },
  {
    title: "Cloud & DevOps",
    core: ["Kubernetes", "Docker", "AWS"],
    extra: ["GitHub Actions", "Jenkins", "Splunk", "Grafana", "Linux"],
  },
];

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  live?: string;
  repo?: string;
  /** Path under /public — shown as a framed screenshot in the project card. */
  image?: string;
  status: "live" | "wip" | "archived";
}

export const projects: Project[] = [
  {
    id: "dimensys",
    name: "Dimensys",
    tagline: "Don't read about system design. Break it.",
    description:
      "An interactive interview-preparation platform that turns High-Level Design, Low-Level Design, and DSA problems into 3D spatial simulations you can poke at — real architectures, simulated, instead of static diagrams.",
    stack: ["Next.js", "TypeScript", "3D spatial UI", "System design"],
    live: "https://dimensys.vercel.app",
    repo: "https://github.com/nexus-hash/dimensys",
    image: "dimensys.jpg",
    status: "live",
  },
];

export interface Contribution {
  repo: string;
  /** Formatted star count, e.g. "15.3K". */
  stars: string;
  language: string;
  number: number;
  title: string;
  summary: string;
  status: "merged" | "open" | "in-progress";
  date: string;
  diff?: { add: number; del: number };
  url: string;
  /** The upstream issue this work addresses. */
  issue?: { number: number; url: string };
}

/** Upstream contributions, newest first. Status labels: merged / open (PR up) / in-progress (issue triaged, PR being redone). */
export const openSource: Contribution[] = [
  {
    repo: "jupyterlab/jupyterlab",
    stars: "15.3K",
    language: "TypeScript",
    number: 19817,
    title: "Stop xterm.js from detecting the browser as Node",
    summary:
      "The webpack process shim sets process.title, which makes xterm.js think it runs in Node and skip navigator.platform — so isMac is false and Option+digit, | and {} stop working in the macOS terminal. Fixes the detection at the bundle level.",
    status: "open",
    date: "Sep 2026",
    diff: { add: 64, del: 0 },
    url: "https://github.com/jupyterlab/jupyterlab/pull/19817",
    issue: { number: 16489, url: "https://github.com/jupyterlab/jupyterlab/issues/16489" },
  },
  {
    repo: "jupyterlab/jupyter-builder",
    stars: "15",
    language: "TypeScript",
    number: 185,
    title: "Provide a process shim without title",
    summary:
      "Companion to the xterm fix, at the build-tool layer: ships a process polyfill that doesn't set title, so every extension bundle built with @jupyter/builder gets correct platform detection for free.",
    status: "open",
    date: "Sep 2026",
    diff: { add: 17, del: 2 },
    url: "https://github.com/jupyterlab/jupyter-builder/pull/185",
    issue: { number: 16489, url: "https://github.com/jupyterlab/jupyterlab/issues/16489" },
  },
  {
    repo: "processing/p5.js",
    stars: "24K",
    language: "JavaScript",
    number: 9208,
    title: "loadFont() drops every glyph for variable fonts with short gvar offsets",
    summary:
      "Root-caused Typr's gvar parser reading all glyph-variation offsets as 4-byte values and ignoring the flags bit for the 2-byte form. Most Google variable fonts use the short form, so the whole table misaligned. Fix proposed; PR being redone against the triaged issue per maintainer process.",
    status: "in-progress",
    date: "Sep 2026",
    diff: { add: 110, del: 9 },
    url: "https://github.com/processing/p5.js/issues/9208",
    issue: { number: 7486, url: "https://github.com/processing/p5.js/issues/7486" },
  },
  {
    repo: "jupyterlab/jupyterlab",
    stars: "15.3K",
    language: "TypeScript",
    number: 19714,
    title: "Defer Tab to the completer only when it's actually bound",
    summary:
      "Tab was hijacked by autocomplete even after users rebound the completer shortcut, so they couldn't insert a tab. Added a command-registry editor extension so the CodeMirror keymap checks the live binding before deferring.",
    status: "merged",
    date: "Sep 2026",
    diff: { add: 383, del: 4 },
    url: "https://github.com/jupyterlab/jupyterlab/pull/19714",
    issue: { number: 16164, url: "https://github.com/jupyterlab/jupyterlab/issues/16164" },
  },
];

export const openSourceSearchUrl = "https://github.com/search?q=is%3Apr+author%3Anexus-hash&type=pullrequests";

export const education = {
  school: "Vellore Institute of Technology",
  degree: "B.Tech, Computer Science Engineering",
  dates: "Jul 2019 — Jul 2023",
};

export const heroStats = [
  { value: "10x", label: "settlement throughput" },
  { value: "100M+", label: "payment events / day" },
  { value: "450", label: "engineering days saved via AI" },
];

/** Phrases cycled by the hero typewriter. */
export const heroRoles = [
  "distributed payment systems",
  "agentic AI pipelines",
  "Kafka event platforms",
  "developer-facing RAG tooling",
];

export const contact = {
  email: "srtsoumya21@gmail.com",
  github: "https://github.com/nexus-hash",
  linkedin: "https://linkedin.com/in/nexus-hash",
  /** Shown in the nav clock so visitors see *your* local time, not theirs. */
  timezone: { iana: "Asia/Kolkata", label: "IST" },
};

export const site = {
  url: "https://nexus-hash.github.io",
  name: "Soumya Ranjan Tripathy",
  title: "Soumya Ranjan Tripathy — Backend Engineer",
  description:
    "Backend engineer building distributed payment infrastructure and agentic AI systems at Visa.",
};
