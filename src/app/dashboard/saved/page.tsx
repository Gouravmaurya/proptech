import { getSavedProperties } from "@/app/actions/user";
import PropertyCard from "@/components/PropertyCard";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function SavedPage() {
    const savedProperties = await getSavedProperties();
    const count = savedProperties?.length || 0;

    if (!savedProperties || count === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-rose-50 p-6 rounded-full mb-6 shadow-sm border border-rose-100">
                    <Sparkles className="w-10 h-10 text-rose-400" />
                </div>
                <h1 className="text-3xl font-heading text-slate-900 mb-3 tracking-tight">Your Collection is Empty</h1>
                <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                    You haven't saved any properties yet. Start exploring the market to curate your personal portfolio of investment opportunities.
                </p>
                <Link
                    href="/dashboard"
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-slate-200/50 active:scale-95 flex items-center gap-2"
                >
                    Explore Properties <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-3xl font-heading text-slate-900 tracking-tight">Saved Properties</h1>
                    <p className="text-slate-500 mt-2">Your curated list of investment opportunities.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-600">
                    <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-xs font-bold">{count}</span>
                    <span>Saved Items</span>
                </div>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {savedProperties.map((property: any, index: number) => (
                    <div key={property.id} className="break-inside-avoid mb-6">
                        <PropertyCard
                            property={property}
                            index={index}
                            href={`/properties/${property.zpid || property.id}`}
                            initialSaved={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
