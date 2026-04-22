"use client";

import { Search, Bell, ArrowRight } from "lucide-react"; // Import ArrowRight
import { motion } from "framer-motion";
import { useState } from "react"; // Import useState
import { useSession } from "next-auth/react";

interface DashboardHeaderProps {
    onSearch?: (query: string) => void;
}

export default function DashboardHeader({ onSearch }: DashboardHeaderProps) {
    const { data: session } = useSession();
    const user = session?.user || { name: "Guest" };

    // Local state for input
    const [inputValue, setInputValue] = useState("");

    // Handle Submit (Enter key or Button Click)
    const handleSubmit = () => {
        if (onSearch) {
            onSearch(inputValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    // Time-based greeting logic
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">

            {/* Top Row (Greeting) */}
            <div className="flex items-center gap-6">
                <div className="space-y-1">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-stone-400 text-xs font-medium tracking-widest uppercase"
                    >
                        Dashboard
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-heading text-3xl md:text-5xl text-zinc-900"
                    >
                        {timeGreeting}, <span className="italic text-stone-500 font-light">{user.name}.</span>
                    </motion.h1>
                </div>
            </div>

            {/* Minimal Utility Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-6 self-end md:self-auto"
            >
            </motion.div>
        </header>
    );
}
