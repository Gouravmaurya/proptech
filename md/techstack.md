
🛠️ Haven AI: Technical Stack Configuration (tech-stack.json)
JSON
{
  "project_name": "Haven AI",
  "version": "1.0.0",
  "foundation": {
    "framework": "Next.js 16 (App Router)",
    "language": "TypeScript",
    "styling": "Tailwind CSS",
    "orm": "Prisma"
  },
  "database": {
    "provider": "PostgreSQL",
    "hosting": "Supabase / Neon",
    "features": ["Relational Schema", "Vector Support (pgvector)"]
  },
  "intelligence": {
    "llm": "Gemini 1.5 Pro / Flash",
    "orchestration": "Vercel AI SDK",
    "agents": ["Scout", "Underwriter", "Outreach"]
  },
  "ux_motion": {
    "smooth_scroll": "Lenis",
    "scroll_animations": "GSAP (GreenSock)",
    "micro_interactions": "Framer Motion",
    "ui_components": "Shadcn/UI"
  }
}
📦 Core Dependencies (package.json extract)
You can use this list to initialize your environment with the exact tools we discussed.

JSON
{
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@prisma/client": "^5.0.0",
    "@google/generative-ai": "^0.21.0",
    "ai": "^3.0.0",
    "gsap": "^3.12.5",
    "framer-motion": "^11.0.0",
    "@studio-freight/react-lenis": "^0.0.47",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "prisma": "^5.0.0",
    "tailwindcss": "^3.4.0"
  }
}
🏗️ Architecture Blueprint
1. Data Intelligence (Prisma + Gemini)
Strict Relational Logic: Every property found by the Scout Agent is validated via Prisma before being processed by the Underwriter Agent.

Contextual Reasoning: Gemini 1.5 Pro analyzes market data, tax records, and descriptions to generate the financial metrics stored in your PostgreSQL database.

2. Motion System (GSAP + Lenis)
Global Scroll: Lenis provides a unified smooth-scrolling experience across all routes (/, /explore, /property/[id]).

Dynamic Visualization: GSAP handles the entrance of property cards and the real-time drawing of investment growth charts.

3. Agentic Workflow
Server Actions: All agent logic (Gemini API calls) must run in use server blocks to maintain security and avoid exposing your Gemini API keys.