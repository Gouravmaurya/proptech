# Haven AI - Implementation Plan

## 1. Project Overview
**Haven AI** is a premium real estate investment platform powered by a Multi-Agent System (Scout, Underwriter, Outreach). It features a high-end "Midnight Obsidian" aesthetic with "Apple-level" smooth interactions.

## 2. Architecture & Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Midnight Obsidian Theme), Shadcn/UI
- **Motion:** GSAP, Lenis (Smooth Scroll), Framer Motion
- **Database:** PostgreSQL (Supabase/Neon) via Prisma ORM
- **AI:** Google Gemini 1.5 Pro/Flash via Vercel AI SDK

## 3. Implementation Phases

### Phase 1: Foundation & Configuration
- Initialize Next.js 16 project.
- Configure Tailwind CSS with the defined color palette/typography.
- Install and configure GSAP, Lenis, and Framer Motion.
- Set up directory structure (`/agents`, `/lib/ai`, `/components/ui`).

### Phase 2: Database & Schema
- Initialize Prisma.
- Design `schema.prisma` for:
  - `Property` (including financial metrics).
  - `User` (preferences, history).
  - `AgentActivity` (logs for Scout, Underwriter, Outreach).
- Set up connection to PostgreSQL.

### Phase 3: Core UI Development
- **Global Layout:** Implement `ReactLenis` for smooth scrolling.
- **Components:**
  - `PropertyCard` (Bento style, glassmorphism).
  - Navigation Bar & Footer.
  - Sidebar for AI Chat.
- **Pages:**
  - **Home:** Hero section with GSAP animations.
  - **Explore:** Map integration + Property List.
  - **Property Details:** 360 viewer placeholder, Financial Data visualization.

### Phase 4: AI & Agent System
- **Integration:** Set up Google Gemini API access.
- **Agents:**
  - **Scout:** Logic to ingest/seed property listings.
  - **Underwriter:** Algorithms/Prompts to calculate Cap Rate/ROI.
  - **Outreach:** Template generation system.
- **Chat Interface:** "Gemini-style" streaming chat UI.

### Phase 5: Testing & Polish
- Verify "Midnight Obsidian" aesthetic consistency.
- Validate animations performance.
- Test Agent outputs with Zod.
