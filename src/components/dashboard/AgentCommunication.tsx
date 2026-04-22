"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, FileText, CheckCircle, Loader2, RefreshCcw, ChevronRight, X } from "lucide-react";
import { getOutreachForLead, generateOutreachDraft, updateOutreachStatus } from "@/app/actions/outreach";

interface AgentCommunicationProps {
    leadId: string;
    title: string;
    price: number;
    analysisId?: string;
}

export default function AgentCommunication({ leadId, title, price, analysisId }: AgentCommunicationProps) {
    const [outreach, setOutreach] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        loadOutreach();
    }, [leadId]);

    async function loadOutreach() {
        setLoading(true);
        const data = await getOutreachForLead(leadId);
        setOutreach(data);
        setLoading(false);
    }

    async function handleGenerate() {
        setIsGenerating(true);
        const result = await generateOutreachDraft({ leadId, title, price, analysisId });
        if (result.ok) {
            setOutreach(result.outreach);
            setExpanded(true);
        }
        setIsGenerating(false);
    }

    async function handleUpdateStatus(newStatus: string) {
        if (!outreach) return;
        setIsUpdating(true);
        const result = await updateOutreachStatus(outreach.id, newStatus, leadId);
        if (result.ok) {
            setOutreach({ ...outreach, status: newStatus });
        }
        setIsUpdating(false);
    }

    if (loading) {
        return (
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-100 animate-pulse">
                <div className="h-4 w-32 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
                    <div className="h-20 w-full bg-slate-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 overflow-hidden relative"
        >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

            <div className="flex items-center justify-between mb-6">
                <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Communication Agent
                </h4>
                {outreach && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${outreach.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                        {outreach.status}
                    </span>
                )}
            </div>

            {!outreach ? (
                <div className="space-y-4">
                    <p className="text-sm text-slate-500 leading-relaxed">
                        No outreach has been initiated for this property yet. The agent can draft a professional inquiry tailored to this listing.
                    </p>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70 group"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        )}
                        Draft Inquiry Email
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div
                        className={`bg-slate-50 rounded-2xl p-4 border border-slate-100 transition-all duration-300 ${expanded ? '' : 'max-h-32 overflow-hidden relative cursor-pointer'
                            }`}
                        onClick={() => !expanded && setExpanded(true)}
                    >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                            <FileText className="w-3 h-3" /> Subject
                        </div>
                        <div className="text-sm font-semibold text-slate-900 mb-4">{outreach.subject}</div>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                            <Mail className="w-3 h-3" /> Body
                        </div>
                        <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed italic">
                            {outreach.body}
                        </div>

                        {!expanded && (
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-50 to-transparent flex items-end justify-center pb-2">
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                    Click to expand <ChevronRight className="w-3 h-3 rotate-90" />
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {outreach.status !== 'sent' ? (
                            <button
                                onClick={() => handleUpdateStatus('sent')}
                                disabled={isUpdating}
                                className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-slate-900/10"
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Mark as Sent
                            </button>
                        ) : (
                            <div className="flex-1 bg-emerald-50 text-emerald-700 font-bold py-3 rounded-2xl border border-emerald-100 flex items-center justify-center gap-2 cursor-default">
                                <CheckCircle className="w-4 h-4" />
                                Message Sent
                            </div>
                        )}
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-400"
                        >
                            {expanded ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-90" />}
                        </button>
                    </div>

                    {expanded && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] text-center text-slate-400 font-medium"
                        >
                            This draft was generated by the Haven Agent. We recommend reviewing for accuracy before sending.
                        </motion.p>
                    )}
                </div>
            )}
        </motion.div>
    );
}
