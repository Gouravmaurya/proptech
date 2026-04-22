# Architecture & Tech Stack

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript/TypeScript (Mixed codebase, moving to TS)
- **Database**: PostgreSQL (managed via Prisma ORM)
  - *Note: Legacy documentation references Firebase/Firestore, but the codebase uses Prisma.*
- **AI/LLM**: Google Gemini (via `@google/generative-ai`)
- **Styling**: Tailwind CSS v4, Framer Motion
- **Auth**: NextAuth / Firebase Auth (Legacy references exist, check `auth.ts` vs `firebase.js`)

## Directory Structure
```
/app
  /api              # Backend API Routes
    /agents         # Agent endpoints (scout, underwriting, pipeline, etc.)
    /ai             # AI services (chat, analyze)
  /auth             # Authentication routes
  /dashboard        # Main application UI
  /components       # Reusable UI components
/lib
  agentKnowledge.js # Agent personas and system prompts
  ai.js             # Financial math engine (Deterministic)
  prisma.ts         # Database client
/prisma
  schema.prisma     # Database schema definition
```

## Database Schema (Key Models)
Based on `prisma/schema.prisma`:

- **Property**: Stores listings with `financials` (JSON) and `images`.
- **Lead**: Potential deals being tracked, with `score`, `tier`, and `status`.
- **Analysis**: Deep dive reports linked to Leads, containing `verdict`, `score`, and `financials`.
- **Agent/AgentLog**: Tracks agent activities and execution logs.
- **PipelineRun**: Stores sessions of multi-agent execution.
- **User/Account**: Standard auth models.

## API Architecture
- **`/api/ai/chat`**: Handles user-agent conversation. Uses `agentKnowledge.js` to detect intent (Legal vs Financial vs Market) and route queries.
- **`/api/ai/analyze`**: Runs the financial engine to generate Cap Rate, IRR, NPV, etc.
- **`/api/agents/*`**: specialized endpoints for specific agent tasks.
  - **Pipeline**: Experiments with parallel agent execution (see `app/api/agents/pipeline`).

## Key Discrepancy Note
The existing `docs/` folder in the source codebase heavily references Firebase. However, the presence of `lib/prisma.ts` and `prisma/schema.prisma` confirms that the project is using (or migrating to) a relational database (Postgres) with Prisma. **Future development should assume Prisma/Postgres.**
