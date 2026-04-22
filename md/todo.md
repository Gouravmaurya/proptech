# Haven AI - To-Do Checklist

## 1. Setup & Config
- [ ] Initialize Next.js 16 application with TypeScript `npx create-next-app@latest`.
- [ ] Install UI dependencies: `npm install gsap framer-motion @studio-freight/react-lenis lucide-react clsx tailwind-merge`.
- [ ] Install AI/DB dependencies: `npm install @prisma/client @google/generative-ai ai zod`.
- [ ] Install User interaction dependencies: `npm install @radix-ui/react-slot class-variance-authority`.
- [ ] Configure `tailwind.config.ts` with "Midnight Obsidian" palette (#0F0F0F, #1A1A1A, #D4AF37).
- [ ] Configure `app/layout.tsx` with `ReactLenis` provider.

## 2. Database (Prisma)
- [ ] Initialize Prisma: `npx prisma init`.
- [ ] Define `Property` model in `schema.prisma` (fields: price, roi, capRate, sqft, address, image).
- [ ] Run migration: `npx prisma migrate dev --name init`.
- [ ] Seed database with mock "Scouted" properties.

## 3. Components & UI
- [ ] Create `components/PropertyCard.tsx` with Framer Motion hover effects.
- [ ] Create `components/Navbar.tsx` and `components/Footer.tsx`.
- [ ] Create `components/Hero.tsx` with GSAP entrance animations.
- [ ] Build `/app/page.tsx` (Home) integrating Hero and Property showcase.
- [ ] Build `/app/explore/page.tsx` layout (Map + Sidebar).
- [ ] Build `/app/property/[id]/page.tsx` skeleton.

## 4. AI & Agents
- [ ] Create `lib/ai/config.ts` for Gemini API initialization.
- [ ] Create `actions/analyze-property.ts` (Underwriter Agent).
- [ ] Create `actions/generate-outreach.ts` (Outreach Agent).
- [ ] Build `components/ai/ChatInterface.tsx` with streaming text support.

## 5. Final Polish
- [ ] Review all animations for smoothness (Lenis implementation).
- [ ] Ensure mobile responsiveness.
- [ ] Verify Zod validation for AI outputs.
