"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function SidebarWrapper() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Sidebar
            isOpen={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
        />
    );
}
