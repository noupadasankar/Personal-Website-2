/* =============================================================
   config.js — ⭐ YOUR SINGLE SOURCE OF TRUTH (the site's ".env")
   -------------------------------------------------------------
   Edit ONLY this file to change every link, email, résumé and
   project on the site. Nothing else needs touching.

   • A browser can't read a real .env file without a build step,
     so this JS config is the static-site equivalent — same idea,
     zero tooling, works the instant you deploy.
   • Leave a value as "" (empty) to automatically HIDE that link.
============================================================= */

export const CONFIG = {

  /* ---------------------------------------------------------
     1) LINKS  — paste your URLs here
  --------------------------------------------------------- */
  links: {
    github: "https://github.com/noupadasankar",
    linkedin: "https://www.linkedin.com/in/shankar-noupada-7a5b77301",
    leetcode: "https://leetcode.com/u/noupadashankar78/",
    twitter: "",                       // optional — leave "" to hide the X/Twitter link
    email: "noupadashankar78@gmail.com",
    resume: "SANKAR_RESUME.pdf",      // file path or full URL
  },

  /* Contact form endpoint (FormSubmit). Leave blank to auto-build
     it from the email above. */
  formEndpoint: "",

  /* ---------------------------------------------------------
     2) PROJECTS  — add / edit / reorder freely
     Image guide:  1200 × 750 px  (16:10).  Any size works (it's
     cropped to fit), but 16:10 looks cleanest. Put files in
     assets/img/ and reference them below.
  --------------------------------------------------------- */
  projects: [
    {
      title: "TeleHealth Web Application",
      year: "2025",
      category: "fullstack frontend",        // used by the filter buttons
      desc: "Real-time telehealth platform with secure video consultations, auth and cloud storage.",
      image: "assets/img/project-telehealth.png",
      imageAlt: "TeleHealth web application preview",
      tags: ["React.js", "Firebase", "Tailwind"],
      live: "",                           // "" hides the Live demo button
      repo: "",                           // "" hides the Source button
      challenge: "Patients and doctors needed secure, low-latency video consultations with reliable scheduling and auth — without a heavyweight native app.",
      solution: "Built a responsive React SPA with Firebase auth and realtime data, integrated secure video sessions, appointment scheduling and cloud-stored records.",
      result: "A production-grade telehealth flow: instant onboarding, encrypted sessions and a clean, accessible UI that works across devices.",
    },
    {
      title: "Citizen Grievance Portal",
      year: "2025",
      category: "fullstack",
      desc: "Civic-issue reporting platform with location tagging, status tracking and authority dashboards.",
      image: "assets/img/project-grievance.jpg",
      imageAlt: "Citizen grievance management portal preview",
      tags: ["Full Stack", "MongoDB", "Node.js"],
      live: "",
      repo: "",
      challenge: "Citizens lacked a single, transparent channel to report civic issues and track resolution; authorities lacked structured routing.",
      solution: "Designed a centralized portal with location-tagged complaints, status tracking, role-based dashboards for authorities and a clean reporting flow.",
      result: "A transparent, accountable pipeline from complaint to resolution with location intelligence and real-time status visibility.",
    },

    /* ---- ⬇ PRESET: your next project. Swap the text + image. ---- */
    {
      title: "OmniTask AI",
      year: "2026",
      category: "Full-Stack AI Automation Platform",
      desc: "The operating system for human intent — users speak or type any goal and autonomous AI agents execute it completely in a real browser, without manual intervention.",
      image: "assets/img/Screenshot 2026-06-14 193120.png",
      imageAlt: "OmniTask AI — Live browser automation dashboard with real-time agent view",
      tags: [
        "NestJS", "Next.js", "Python", "Playwright",
        "PostgreSQL", "pgvector", "Redis", "BullMQ",
        "OpenAI", "TypeScript", "Docker", "Stripe"
      ],
      live: "",
      repo: "https://github.com/noupadasankar",
      challenge: `Most automation tools require users to build workflows, write scripts, or learn complex interfaces. Real-world tasks — job applications, travel booking, research, bill payments — still require hours of manual clicking across dozens of websites. There was no product that could take a plain English instruction and execute it completely on the open web without human involvement.`,
      solution: `Built a full-stack cognitive automation platform with a NestJS backend (47 modules, 123 services), a Next.js 14 frontend with a live browser dashboard, and a standalone Python Playwright engine that controls a real Chromium browser. The system uses a Planner → Executor → Critic → Memory cognitive loop, 20 specialized domain agents (job, travel, research, finance, email, shopping and more), a pgvector-powered memory system that learns user preferences over time, and a 5-layer defense-in-depth safety architecture with approval gates. All agent state flows through Redis pub/sub, all credentials are encrypted with AES-256-GCM via a custom Vault service, and the entire stack is containerized with Docker and monitored via Prometheus and Grafana.`,
      result: `Delivered a production-grade autonomous agent platform capable of executing complex multi-step tasks across the real internet with no user intervention. The system supports 20 domain agents running in parallel, persistent cognitive memory across sessions, live browser streaming to the user dashboard, self-healing selector recovery when websites change, and a full enterprise feature set including Stripe billing, RBAC, audit logging, GDPR compliance, and webhook delivery. Architectural complexity equivalent to what a team of 10 engineers typically ships in 18 months.`,
    },
  ],
};
