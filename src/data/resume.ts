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
          "Designed and built a distributed, seamlessly integrating, developer-facing RAG platform with hybrid search, reducing org-wide token spend by 15%.",
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

export const project = {
  name: "Dimensys",
  tagline: "Next.js · 3D spatial UI · System design",
  description:
    "An interactive interview-preparation platform built on Next.js, using 3D spatial demonstrations to make complex High-Level Design, Low-Level Design, and DSA problems tangible instead of abstract.",
};

export const education = {
  school: "Vellore Institute of Technology",
  degree: "B.Tech, Computer Science Engineering",
  dates: "Jul 2019 — Jul 2023",
};

export const heroStats = [
  { value: "10x", label: "settlement throughput" },
  { value: "1M+", label: "logs processed / sec" },
  { value: "100+", label: "repos automated via AI" },
];

export const contact = {
  email: "srtsoumya21@gmail.com",
  github: "https://github.com/nexus-hash",
  linkedin: "https://linkedin.com/in/nexus-hash",
};
