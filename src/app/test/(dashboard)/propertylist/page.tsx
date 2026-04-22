import { promises as fs } from 'fs';
import path from 'path';
import PropertyGrid from '@/components/test/PropertyGrid';
import { Search, Sparkles, Filter, ArrowDownWideNarrow } from 'lucide-react';
import { auth } from '@/auth';

async function getRawProperties() {
    try {
        const filePath = path.join(process.cwd(), 'resting', 'zillow_raw.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return data.data || [];
    } catch (error) {
        console.error("Error reading mock data:", error);
        return [];
    }
}

function getGreeting(hour: number) {
    if (hour >= 5 && hour < 12) {
        return {
            time: "Good Morning",
            emoji: "☀️",
            message: "Every sunrise brings new possibilities. Today could be the day you find the one.",
            subtext: "Fresh listings await"
        };
    } else if (hour >= 12 && hour < 17) {
        return {
            time: "Good Afternoon",
            emoji: "🌤️",
            message: "The best investments are made when you follow your heart and trust your vision.",
            subtext: "Perfect time to explore"
        };
    } else if (hour >= 17 && hour < 21) {
        return {
            time: "Good Evening",
            emoji: "🌅",
            message: "Home is where your story begins. Let's find the perfect chapter for yours.",
            subtext: "Wind down with inspiration"
        };
    } else {
        return {
            time: "Hello, Night Owl",
            emoji: "🌙",
            message: "Some of the best decisions are made in quiet moments. Dream big tonight.",
            subtext: "Late-night discoveries"
        };
    }
}

export default async function TestPropertyListPage() {
    const properties = await getRawProperties();
    const session = await auth();
    const userName = session?.user?.name?.split(" ")[0] || "Explorer";

    const currentHour = new Date().getHours();
    const greeting = getGreeting(currentHour);

    return (
        <div className="min-h-full bg-slate-50">

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/80 via-white to-white pointer-events-none" />

                <div className="relative max-w-[1600px] mx-auto px-6 md:px-8 py-8 md:py-12">

                    {/* Greeting Row */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                        <div className="space-y-3 max-w-xl">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{greeting.emoji}</span>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                    {greeting.time}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                                Hey <span className="text-emerald-600">{userName}</span>, let's find your next chapter
                            </h1>

                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                {greeting.message}
                            </p>
                        </div>

                        {/* Stats Pills */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-sm font-semibold text-emerald-700">{properties.length} Live Listings</span>
                            </div>
                            <div className="bg-slate-100 px-4 py-2 rounded-full flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-sm font-medium text-slate-600">AI Curated</span>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by city, address, or ZIP..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors">
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors">
                                <ArrowDownWideNarrow className="w-4 h-4" />
                                Sort
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Grid */}
            <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
                <PropertyGrid properties={properties} />
            </div>

        </div>
    );
}
