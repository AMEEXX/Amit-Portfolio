// src/data/skills.ts
export enum SkillName {
  JS = "js",
  TS = "ts",
  HTML = "html",
  CSS = "css",
  REACT = "react",
  VUE = "vue",
  NEXTJS = "nextjs",
  TAILWIND = "tailwind",
  NODEJS = "nodejs",
  EXPRESS = "express",
  POSTGRES = "postgres",
  MONGODB = "mongodb",
  GIT = "git",
  GITHUB = "github",
  PRETTIER = "prettier",
  NPM = "npm",
  FIREBASE = "firebase",
  WORDPRESS = "wordpress",
  LINUX = "linux",
  DOCKER = "docker",
  NGINX = "nginx",
  AWS = "aws",
  GCP = "gcp",
  VIM = "vim",
  VERCEL = "vercel",
}

export type Skill = {
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};

export const SKILLS: Partial<Record<SkillName, Skill>> = {
  [SkillName.REACT]: {
    name: "react",
    label: "React",
    shortDescription: "Component-driven UIs, hooks, the whole ecosystem.",
    color: "#61dafb",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  [SkillName.TS]: {
    name: "ts",
    label: "TypeScript",
    shortDescription: "Types on everything, fewer runtime surprises.",
    color: "#007acc",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  [SkillName.JS]: {
    name: "js",
    label: "JavaScript",
    shortDescription: "The language of the web — async, event-driven, versatile.",
    color: "#f7df1e",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  [SkillName.NODEJS]: {
    name: "nodejs",
    label: "Node.js",
    shortDescription: "Server-side JS — REST APIs, streaming, real-time apps.",
    color: "#339933",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  [SkillName.DOCKER]: {
    name: "docker",
    label: "Docker",
    shortDescription: "Containerise everything — ship consistently across envs.",
    color: "#2496ed",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  [SkillName.POSTGRES]: {
    name: "postgres",
    label: "PostgreSQL",
    shortDescription: "Relational DB powerhouse — complex queries, ACID, JSON.",
    color: "#4169e1",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  [SkillName.MONGODB]: {
    name: "mongodb",
    label: "MongoDB",
    shortDescription: "Document store for flexible schemas and fast iteration.",
    color: "#47a248",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  [SkillName.AWS]: {
    name: "aws",
    label: "AWS",
    shortDescription: "EC2, S3, Lambda, RDS — cloud infra at any scale.",
    color: "#ff9900",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
  },
  [SkillName.GCP]: {
    name: "gcp",
    label: "Google Cloud",
    shortDescription: "GKE, BigQuery, Cloud Run — Google-scale infrastructure.",
    color: "#4285f4",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
  },
  [SkillName.GIT]: {
    name: "git",
    label: "Git",
    shortDescription: "Version control — branches, rebases, clean history.",
    color: "#f05032",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  [SkillName.LINUX]: {
    name: "linux",
    label: "Linux",
    shortDescription: "The backbone — shell scripting, process management, servers.",
    color: "#fcc624",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
  [SkillName.NGINX]: {
    name: "nginx",
    label: "Nginx",
    shortDescription: "High-performance reverse proxy and web server.",
    color: "#009639",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
  },
  [SkillName.TAILWIND]: {
    name: "tailwind",
    label: "Tailwind CSS",
    shortDescription: "Utility-first CSS — fast, consistent, no stylesheet bloat.",
    color: "#06b6d4",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  [SkillName.GITHUB]: {
    name: "github",
    label: "GitHub",
    shortDescription: "Pull requests, CI/CD, Actions — collaborative shipping.",
    color: "#ffffff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  [SkillName.HTML]: {
    name: "html",
    label: "HTML",
    shortDescription: "Semantic markup — accessible, SEO-friendly structure.",
    color: "#e34f26",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  [SkillName.CSS]: {
    name: "css",
    label: "CSS",
    shortDescription: "Layouts, animations, variables — pixel-perfect styling.",
    color: "#1572b6",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
};
