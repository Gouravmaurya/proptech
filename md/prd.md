🏗️ Haven AI: Master PRD & TRD1. Product Architecture (The Page Logic)RoutePurposeKey Features/Home PageHero section with high-impact GSAP animations and the primary value proposition./exploreMarket DiscoveryMap-based UI with search/filters (similar to the shared UI designs) displaying "hot deals" clusters./property/[id]Property Deep-Dive360° panorama views, embedded Underwriting Agent data (ROI/Cap Rate), and the Outreach Agent panel./aiAgent HeadquartersA "Gemini-style" chat interface to interact with the Scout, Underwriting, and Outreach agents directly.2. Multi-Agent System FunctionalityThe platform operates through a specialized Multi-Agent Orchestration system:Scout Agent: Monitors property feeds (Zillow/MLS) for distress signals and listings matching user criteria.Underwriting Agent: Performs automated financial analysis, calculating ROI, Cap Rate, and Cash-on-Cash Return.Outreach Agent: Drafts hyper-personalized emails and Letters of Intent (LOI) to brokers and listing agents.3. Folder Structure (Next.js 16 App Router)This structure is optimized for Prisma type-safety and GSAP/Lenis performance.Plaintext/src
├── /app
│   ├── /api (Agent endpoints)
│   ├── /explore (Map & listing view)
│   ├── /property/[id] (Detail & Underwriting page)
│   ├── /ai (Gemini-style chat interface)
│   ├── layout.tsx (Lenis Smooth Scroll Provider)
│   └── page.tsx (Home Page)
├── /components
│   ├── /agents (Scout, Underwriter, Outreach UI)
│   ├── /ui (Shadcn + Tailwind components)
│   └── /animations (GSAP & Framer Motion wrappers)
├── /lib
│   ├── /ai (Gemini LLM logic & Agent prompts)
│   ├── /prisma (Database client & schemas)
│   └── /utils (Financial math logic)
├── /prisma
│   └── schema.prisma (PostgreSQL relational models)
└── /styles (Tailwind + Lenis globals)
4. Technical Requirements (TRD)A. Backend & IntelligenceModel: Gemini 
 streaming agent responses.ORM: Prisma with PostgreSQL (Supabase/Neon) for strictly relational property data.Logic: Server Actions to handle Gemini orchestration to keep API keys secure.B. Frontend & InteractionMotion: Lenis for global smooth scrolling; GSAP for scroll-triggered data visualization; Framer Motion for UI state transitions.Performance: React Server Components (RSC) to fetch property data via Prisma directly on the server, minimizing client-side lag.C. Data IntegrityStrict Validation: All Gemini outputs for financial math must be validated using Zod to prevent hallucinated ROI figures.