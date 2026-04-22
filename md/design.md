🎨 Haven AI Design Specification
1. Global Theme Configuration (tailwind.config.ts)
This setup uses the "Midnight Obsidian" palette you requested for a premium FinTech feel.

TypeScript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        background: "#0F0F0F", // Deep Obsidian
        surface: "#1A1A1A",    // Card background
        primary: "#FFFFFF",    // Clean Slate
        accent: "#D4AF37",     // High-Contrast Gold for ROI/Cap Rate
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'], //
      },
    }
  }
}
2. Core UI Component: The Bento Property Card
Based on the Estately reference you shared, this card integrates your AI Agent metrics.

TypeScript
// components/PropertyCard.tsx
import { motion } from 'framer-motion';

export default function PropertyCard({ property }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-surface rounded-3xl overflow-hidden border border-white/10 p-4 shadow-2xl"
    >
      {/* 1. Immersive Hero Image */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
        <img src={property.imageUrl} className="object-cover w-full h-full" />
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs">
          AI Scouted
        </div>
      </div>

      {/* 2. Intelligence Metrics (Prisma + Underwriter Agent) */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-background p-2 rounded-xl border border-white/5">
          <p className="text-[10px] uppercase text-gray-500">ROI</p>
          <p className="text-accent font-bold text-lg">{property.roi}%</p>
        </div>
        <div className="bg-background p-2 rounded-xl border border-white/5">
          <p className="text-[10px] uppercase text-gray-500">Cap Rate</p>
          <p className="text-white font-bold text-lg">{property.capRate}%</p>
        </div>
        <div className="bg-background p-2 rounded-xl border border-white/5">
          <p className="text-[10px] uppercase text-gray-500">Sqft</p>
          <p className="text-white font-bold text-lg">{property.sqft}</p>
        </div>
      </div>

      {/* 3. Action Area */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">${property.price.toLocaleString()}</h3>
          <p className="text-sm text-gray-400">{property.address}</p>
        </div>
        <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-accent transition-colors">
          Analyze
        </button>
      </div>
    </motion.div>
  );
}
3. Global Interaction (Lenis + GSAP)
To achieve the "Apple-level" feel, include this in your root layout.

TypeScript
// app/layout.tsx
"use client";
import { ReactLenis } from '@studio-freight/react-lenis';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
4. Interactive Navigation Map
Home (/): High-impact GSAP text animations for "Real Estate for Living and Investments".

Explore (/explore): A split-view with a Mapbox/Google Map on the right and a Bento list on the left.

Property Detail (/property/[id]): Full-screen 360° panorama viewer powered by Pannellum or Three.js.

AI Chat (/ai): A persistent sidebar chat with Gemini that can trigger the Outreach Agent directly.