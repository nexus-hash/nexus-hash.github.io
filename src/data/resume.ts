export interface ExperienceRole {
  title: string;
  stack: string;
  dates?: string;
  /** "YYYY-MM" or "YYYY-MM-DD". Drives the span position in the career trace. */
  start: string;
  /** "YYYY-MM" (through the end of that month) or "YYYY-MM-DD"; omit for a role that is still running. */
  end?: string;
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
        start: "2025-07",
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
        start: "2023-06-13",
        end: "2025-06",
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
        start: "2023-01",
        end: "2023-06-13",
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
        dates: "Sep 2022 — Dec 2022",
        start: "2022-09",
        end: "2022-12",
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
        dates: "Jul 2022 — Aug 2022",
        start: "2022-07",
        end: "2022-08",
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
        dates: "Jan 2022 — Jun 2022",
        start: "2022-01",
        end: "2022-06",
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
  /** The same view in the project's light theme, shown when this site is in light mode. */
  imageLight?: string;
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
    imageLight: "dimensys-light.jpg",
    status: "live",
  },
];

/** Open source numbers live in oss.json, which `npm run sync:oss` refreshes from GitHub. */
export const openSourceSearchUrl = "https://github.com/search?q=is%3Apr+author%3Anexus-hash+-user%3Anexus-hash&type=pullrequests";

export const education = {
  school: "Vellore Institute of Technology",
  degree: "B.Tech, Computer Science Engineering",
  dates: "Jul 2019 — Jul 2023",
  start: "2019-07",
  end: "2023-07",
};

export const headline = {
  role: "Senior Software Engineer, Visa",
  statement: "I take systems apart to see how they work, then build better ones.",
  lede: "Senior Software Engineer at Visa, where I help move money at scale and build the AI agents that keep it moving. Outside work I fix bugs upstream in open source and build Dimensys, which teaches system design in 3D.",
};

/** Headline outcomes, set as ledger lines in the hero. `source` says where the number comes from. */
export const ledger = [
  { value: "10x", label: "faster settlement", detail: "Visa's two largest payment gateways, migrated to multithreaded microservices", source: "Visa · 2025" },
  { value: "100M+", label: "payment events a day", detail: "Batch event processing system built from scratch, across 50K+ merchants", source: "Visa · 2024" },
  { value: "1M+", label: "log lines a second", detail: "AI triage and root-cause pipeline that cut production incident MTTR", source: "Visa · 2025" },
  { value: "450", label: "engineering days saved", detail: "Claude Code agent generating documentation across 100+ repositories", source: "Visa · 2024" },
];

/** Stages of the animated flow diagram in the hero. */
export const flowStages = [
  { id: "merchants", label: "Merchants", note: "50K+" },
  { id: "gateway", label: "Gateway", note: "24x TPS" },
  { id: "stream", label: "Kafka", note: "100M+/day" },
  { id: "settle", label: "Settlement", note: "10x faster" },
  { id: "agents", label: "AI triage", note: "1M+ logs/s" },
];

/**
 * The train on the right-hand rail: the engine plus one coach per section.
 * `id` is the section's element id. `screen` is the content the coach is wired
 * to: its two right-hand corners anchor the beam, and the rays carry on across
 * the page from there, which is what lights the title above it. `tuck` names a
 * rounded box, if any, so the light can slide under its corners.
 */
export const trainStops: { id: string; name: string; screen: string; tuck?: string }[] = [
  { id: "top", name: "Soumya", screen: "#top .wrap" },
  { id: "impact", name: "Impact", screen: "#impact .wrap" },
  { id: "experience", name: "Experience", screen: "#experience .trace", tuck: "#experience .trace" },
  { id: "projects", name: "Projects", screen: "#projects .feature", tuck: "#projects .feature-shot" },
  { id: "open-source", name: "Open source", screen: "#open-source .os" },
  { id: "skills", name: "Skills", screen: "#skills .manifest" },
  { id: "contact", name: "Contact", screen: "#contact .wrap" },
];

export const contact = {
  email: "srtsoumya21@gmail.com",
  github: "https://github.com/nexus-hash",
  linkedin: "https://linkedin.com/in/nexus-hash",
  /** Shown in the footer so visitors see *your* local time, not theirs. */
  timezone: { iana: "Asia/Kolkata", label: "IST" },
};

export const site = {
  url: "https://nexus-hash.github.io",
  name: "Soumya Ranjan Tripathy",
  title: "Soumya Ranjan Tripathy — Backend Engineer",
  description:
    "Backend engineer building distributed payment infrastructure and agentic AI systems at Visa.",
};
