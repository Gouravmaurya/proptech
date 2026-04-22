"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Heart, BedDouble, Bath, Maximize, TrendingUp, GraduationCap, Banknote } from 'lucide-react';

import { togglePropertySave } from "@/app/actions/user";
import { useState } from "react";

// Variable heights for masonry effect
const heightClasses = ['h-[400px]', 'h-[480px]', 'h-[440px]', 'h-[520px]', 'h-[420px]'];

const TYPE_LABELS: Record<string, string> = {
    "SINGLE_FAMILY": "Single Family",
    "CONDO": "Condo",
    "TOWNHOUSE": "Townhouse",
    "MULTI_FAMILY": "Multi-Family"
};

interface PropertyCardProps {
    property: any;
    index: number;
    href?: string; // Optional custom link
    initialSaved?: boolean;
}

export default function PropertyCard({ property, index, href, initialSaved = false }: PropertyCardProps) {
    const [saved, setSaved] = useState(initialSaved);
    const heightClass = heightClasses[index % heightClasses.length];
    const hasGoodDeal = property.zestimate ? property.price < property.zestimate : (property.rentZestimate && property.price > 0) ? (property.rentZestimate * 12) > (property.price * 0.08) : false;

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!property?.id) {
            console.error("Cannot save property: ID missing", property);
            return;
        }

        setSaved(!saved); // Optimistic update
        try {
            await togglePropertySave(property.id);
        } catch (error) {
            console.error("Failed to save property:", error);
            setSaved(!saved); // Revert on error
        }
    };

    // Use provided href or default to property details page
    const propertyLink = href || `/properties/${property.zpid || property.id}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-500 ${heightClass} border border-slate-100 hover:border-slate-200`}
        >
            <Link href={propertyLink} className="block w-full h-full relative">


                {/* Image Layer */}
                <div className="absolute inset-0 w-full h-full bg-slate-100">
                    {property.imgSrc ? (
                        <motion.div
                            className="relative w-full h-full"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <Image
                                src={property.imgSrc}
                                alt={property.streetAddress}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    // Fallback logic could go here, but next/image handles some of it.
                                    // A robust solution needs a state, but for simplicity we rely on alt text or parent bg.
                                    // Actually, let's just let it be or add a simple state if we were rewriting the component.
                                    // Since we can't easily add state in a multi-line replace without rewriting the whole func,
                                    // we'll rely on the parent bg-slate-100 as fallback visibility.
                                    e.currentTarget.style.display = 'none'; // Hide broken image so bg shows
                                }}
                            />
                        </motion.div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium bg-slate-100">No Image</div>
                    )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />

                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                    <div className="flex gap-2 flex-wrap">
                        <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide text-slate-700 shadow-sm">
                            {TYPE_LABELS[property.homeType] || property.homeType || 'Single Family'}
                        </span>
                        {hasGoodDeal ? (
                            <span className="bg-emerald-500 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide text-white shadow-sm flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Hot Deal
                            </span>
                        ) : property.capRate > 0 ? (
                            <span className="bg-slate-700/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                                {property.capRate.toFixed(1)}% Cap
                            </span>
                        ) : null}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/95 backdrop-blur-sm w-9 h-9 rounded-full shadow-sm flex items-center justify-center hover:bg-rose-50 transition-colors"
                        onClick={handleSave}
                    >
                        <Heart className={`w-4 h-4 transition-colors ${saved ? "fill-rose-500 text-rose-500" : "text-slate-400 group-hover:text-rose-500"}`} />
                    </motion.button>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-4">

                    {/* Price Row */}
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                ${property.price?.toLocaleString()}
                            </div>
                            {property.rentZestimate && (
                                <div className="text-xs text-white/60 font-medium mt-0.5">
                                    Est. ${property.rentZestimate?.toLocaleString()}/mo rent
                                </div>
                            )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white text-slate-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/20" />

                    {/* Address */}
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-white leading-snug line-clamp-1">
                            {property.streetAddress}
                        </h3>
                        <div className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
                            <MapPin className="w-3 h-3" />
                            {property.city}, {property.state} {property.zipcode}
                        </div>

                        {/* Community Highlights */}
                        {(property.bestSchoolRating || property.lastTaxAssessment) && (
                            <div className="flex items-center gap-2 pt-1">
                                {property.bestSchoolRating && (
                                    <div className="flex items-center gap-1 text-[10px] font-black text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-tight">
                                        <GraduationCap className="w-2.5 h-2.5" />
                                        {property.bestSchoolRating}{typeof property.bestSchoolRating === 'number' ? '/10' : ''} School
                                    </div>
                                )}
                                {property.lastTaxAssessment && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-tight">
                                        <Banknote className="w-2.5 h-2.5" />
                                        ${(property.lastTaxAssessment / 1000).toFixed(0)}k Value
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-white/80 text-sm pt-1">
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                            <BedDouble className="w-3.5 h-3.5 text-white/60" />
                            <span className="font-semibold">{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                            <Bath className="w-3.5 h-3.5 text-white/60" />
                            <span className="font-semibold">{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                            <Maximize className="w-3.5 h-3.5 text-white/60" />
                            <span className="font-semibold">{property.livingArea?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

            </Link>
        </motion.div>
    );
}
