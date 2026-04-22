"use client";

import { motion } from 'framer-motion';
import PropertyCard from '../PropertyCard';

export default function PropertyGrid({ properties }: { properties: any[] }) {
    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 px-6 md:px-12 max-w-[1800px] mx-auto">
            {properties.map((p, index) => (
                <div key={p.zpid} className="break-inside-avoid mb-8">
                    <PropertyCard property={p} index={index} />
                </div>
            ))}
        </div>
    );
}
