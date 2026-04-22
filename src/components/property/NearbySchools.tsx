"use client";

import { School } from "@/lib/property-parser";
import { GraduationCap, Star, MapPin, School as SchoolIcon } from "lucide-react";
import { motion } from "framer-motion";

interface NearbySchoolsProps {
    schools: School[];
}

export default function NearbySchools({ schools }: NearbySchoolsProps) {
    if (schools.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <GraduationCap className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-bold text-amber-700">{school.rating}</span>
                        </div>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {school.name}
                    </h4>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                            {school.grades}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{school.distance} mi away</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
