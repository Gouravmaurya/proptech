import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SanctuaryHero from "@/components/landing/test/SanctuaryHero";
import PhilosophySection from "@/components/landing/test/PhilosophySection";
import DreamHomeGallery from "@/components/landing/test/DreamHomeGallery";
import StatsCreative from "@/components/landing/test/StatsCreative";
import BentoFeatures from "@/components/landing/test/BentoFeatures";
import WhyHaven from "@/components/landing/test/WhyHaven";
import LuxuryProcess from "@/components/landing/test/LuxuryProcess";
import CallToAction from "@/components/landing/CallToAction";

export default function TestLandingPage() {
    return (
        <SmoothScroll>
            <main className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#27272A] selection:bg-[#059669]/10 scroll-smooth">
                <Header />

                {/* Cinematic Introduction */}
                <SanctuaryHero />

                {/* Emotional Connection - Narrative Reveal */}
                <PhilosophySection />

                {/* Visual Showcase */}
                <DreamHomeGallery />

                {/* Animated Impact Metrics */}
                <StatsCreative />

                {/* Technical Intelligence */}
                <BentoFeatures />

                {/* The Advantage - Why Haven */}
                <WhyHaven />

                {/* The Journey Narrative */}
                <LuxuryProcess />

                {/* Final Conversion with extra breathing room */}
                <div className="bg-[#FDFBF7] py-40 border-t border-stone-100 relative overflow-hidden">
                    {/* Visual accent for closure */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-emerald-600/30" />
                    <CallToAction />
                </div>

                <Footer />
            </main>
        </SmoothScroll>
    );
}
