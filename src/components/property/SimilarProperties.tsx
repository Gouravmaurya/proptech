"use client";

import { useEffect, useState } from "react";
import { searchProperties } from "@/app/actions/dashboard";
import PropertyCard from "@/components/PropertyCard";
import { Building } from "lucide-react";
import PropertySkeleton from "@/components/ui/PropertySkeleton";

export default function SimilarProperties({ city, currentId }: { city: string, currentId: string }) {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!city) {
            setLoading(false);
            return;
        }
        
        searchProperties(city).then(res => {
            // Deduplicate to avoid showing the same underlying property multiple times from different leads
            const uniquePropsMap = new Map();
            res.forEach((p: any) => {
                const uniqueKey = p.id || p.zpid;
                if (uniqueKey && !uniquePropsMap.has(uniqueKey)) {
                    uniquePropsMap.set(uniqueKey, p);
                } else if (!uniqueKey) {
                    uniquePropsMap.set(Math.random(), p);
                }
            });
            
            const uniqueProps = Array.from(uniquePropsMap.values());
            const similar = uniqueProps.filter((p: any) => (p.id !== currentId && p.zpid !== currentId)).slice(0, 3);
            
            setProperties(similar);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to fetch similar properties", err);
            setLoading(false);
        });
    }, [city, currentId]);

    if (!loading && properties.length === 0) return null;

    return (
        <section className="mt-12 w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-xl">
                    <Building className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Similar Properties Nearby</h2>
                    <p className="text-slate-500 text-sm">Explore other investment opportunities in {city}.</p>
                </div>
            </div>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-[400px] bg-slate-100 rounded-2xl animate-pulse"></div>
                    <div className="h-[400px] bg-slate-100 rounded-2xl animate-pulse hidden md:block"></div>
                    <div className="h-[400px] bg-slate-100 rounded-2xl animate-pulse hidden lg:block"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((p, idx) => (
                        <PropertyCard key={`${p.id || 'noid'}-${p.zpid || 'nozpid'}-${idx}`} property={p} index={idx} />
                    ))}
                </div>
            )}
        </section>
    );
}
