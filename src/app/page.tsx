import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SanctuaryHero from "@/components/landing/SanctuaryHero";
import PhilosophySection from "@/components/landing/PhilosophySection";
import DreamHomeGallery from "@/components/landing/DreamHomeGallery";
import StatsCreative from "@/components/landing/StatsCreative";
import BentoFeatures from "@/components/landing/BentoFeatures";
import WhyProptech from "@/components/landing/WhyProptech";
import LuxuryProcess from "@/components/landing/LuxuryProcess";
import CallToAction from "@/components/landing/CallToAction";
import MarketInsights from "@/components/landing/MarketInsights";
import FAQ from "@/components/landing/FAQ";

export default function LandingPage() {
    return (
        <SmoothScroll>
            <main className="flex flex-col min-h-screen bg-background text-primary selection:bg-emerald-500/10 scroll-smooth transition-colors duration-300">
                <Header />

                {/* Cinematic Introduction */}
                <SanctuaryHero />

                {/* Emotional Connection - Narrative Reveal */}
                <PhilosophySection />

                {/* Visual Showcase */}
                <DreamHomeGallery />

                {/* Animated Impact Metrics */}
                <StatsCreative />

                {/* Market Intelligence Feature */}
                <MarketInsights />

                {/* Technical Intelligence */}
                <BentoFeatures />

                {/* The Advantage - Why Proptech */}
                <WhyProptech />

                {/* The Journey Narrative */}
                <LuxuryProcess />

                <FAQ />

                {/* Final Conversion with extra breathing room */}
                <div className="bg-background py-40 border-t border-stone-100 dark:border-zinc-800 relative overflow-hidden">
                    {/* Visual accent for closure */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-emerald-600/30" />
                    <CallToAction />
                </div>

                <Footer />
            </main>
        </SmoothScroll>
    );
}
