"use client";

import { PriceEvent, TaxRecord } from "@/lib/property-parser";
import { History, TrendingUp, Banknote, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface PropertyHistoryProps {
    priceHistory: PriceEvent[];
    taxHistory: TaxRecord[];
}

export default function PropertyHistory({ priceHistory, taxHistory }: PropertyHistoryProps) {
    if (priceHistory.length === 0 && taxHistory.length === 0) {
        return null;
    }

    return (
        <div className="space-y-8">
            {/* Price History Section */}
            {priceHistory.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Price History
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Event</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price/sqft</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {priceHistory.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-slate-600">{item.date}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.event}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                            ${item.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {item.pricePerSqft ? `$${item.pricePerSqft.toLocaleString()}` : '–'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Tax History Section */}
            {taxHistory.length > 0 && (() => {
                const validTaxRows = taxHistory.filter(
                    item => item.taxPaid > 0 || item.taxAssessment > 0
                );
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Banknote className="w-5 h-5 text-indigo-500" />
                                Tax History
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Year</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Property Tax</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tax Assessment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {validTaxRows.length > 0 ? (
                                        validTaxRows.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-900 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-indigo-400" />
                                                    {item.year}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                                                    ${item.taxPaid.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                                    ${item.taxAssessment.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-400 italic">
                                                No tax data available for this property.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );
            })()}
        </div>
    );
}
