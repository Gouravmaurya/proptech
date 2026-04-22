"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close sidebar on mobile when navigating
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [pathname]);

    return (
        <div className="flex w-full min-h-screen bg-[#FDFBF7] overflow-x-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Desktop Main Content */}
            <main
                className={`flex-1 flex flex-col min-h-screen hidden md:flex transition-all duration-300 ease-in-out`}
                style={{ paddingLeft: isSidebarOpen ? "20rem" : "5rem" }}
            >
                <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>

            {/* Mobile Main Content */}
            <main className="flex-1 flex flex-col min-h-screen md:hidden">
                <div className="p-4 w-full pl-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
