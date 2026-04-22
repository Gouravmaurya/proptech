"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";

function DashboardPageContent() {
    const searchParams = useSearchParams();
    const city = searchParams.get("city") || "";
    const state = searchParams.get("state") || "";
    const urlQuery = [city, state].filter(Boolean).join(", ");

    const [searchQuery, setSearchQuery] = useState(urlQuery);

    // Sync state with URL changes without triggering render loops
    useEffect(() => {
        setSearchQuery(urlQuery);
    }, [urlQuery]);

    return (
        <>
            <DashboardHeader onSearch={setSearchQuery} />
            <div className="mt-12">
                <DashboardContent searchQuery={searchQuery} />
            </div>
        </>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={null}>
            <DashboardPageContent />
        </Suspense>
    );
}

