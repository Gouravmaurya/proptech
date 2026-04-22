"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Sparkles, ArrowRight } from "lucide-react";

const HOMES = [
    {
        id: 1,
        title: "The Minimalist Retreat",
        location: "Aspen, Colorado",
        image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070&auto=format&fit=crop",
        vibe: "Quiet mornings & mountain air",
        tag: "Mountain Side"
    },
    {
        id: 2,
        title: "Azure Horizon Villa",
        location: "Malibu, California",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        vibe: "Sunsets over the Pacific",
        tag: "Beachfront"
    },
    {
        id: 3,
        title: "Ivy Street Townhouse",
        location: "London, UK",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2074&auto=format&fit=crop",
        vibe: "Heritage charm & city life",
        tag: "Urban Classic"
    },
    {
        id: 4,
        title: "Glass House Sanctuary",
        location: "Austin, Texas",
        image: "https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?q=80&w=2070&auto=format&fit=crop",
        vibe: "Seamlessly merged with nature",
        tag: "Modernist"
    }
];

export default function DreamHomeGallery() {
    return (
        <section className="py-32 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Curated Selection</span>
                        <h2 className="text-5xl md:text-6xl font-heading text-zinc-900 mb-6 leading-tight">
                            Discover Your Next <br />
                            <span className="text-emerald-600 italic font-serif">Chapter</span>
                        </h2>
                        <p className="text-stone-500 text-xl leading-relaxed font-light">
                            We curate more than just buildings. We find the backdrop for your family's favorite memories.
                        </p>
                    </div>
                    <button className="group flex items-center gap-3 text-zinc-900 font-bold hover:text-emerald-600 transition-all text-lg">
                        View All Properties
                        <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-emerald-600 group-hover:bg-emerald-50 transition-all">
                            <ArrowRight size={18} />
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {HOMES.map((home, index) => (
                        <motion.div
                            key={home.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl shadow-stone-200/50 group-hover:shadow-2xl transition-all duration-500 bg-white border border-stone-100/50">
                                <img
                                    src={home.image}
                                    alt={home.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />

                                {/* Floating Tags */}
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-900 border border-white/50 shadow-sm">
                                        {home.tag}
                                    </span>
                                </div>

                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="p-3 bg-white/90 backdrop-blur-md rounded-full border border-white/50 shadow-sm hover:bg-white transition-colors">
                                        <Heart size={18} className="text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg">
                                        <p className="text-zinc-600 italic text-sm leading-snug font-light mb-1">
                                            "{home.vibe}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-2">
                                <h3 className="text-2xl font-heading text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {home.title}
                                </h3>
                                <div className="flex items-center gap-2 text-stone-400">
                                    <MapPin size={16} className="text-emerald-500/50" />
                                    <span className="text-sm font-medium tracking-tight uppercase">{home.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
