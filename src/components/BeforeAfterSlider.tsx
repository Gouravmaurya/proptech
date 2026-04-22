
"use client";

import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
    beforeImage,
    afterImage,
    className = "",
}) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const startResizing = () => setIsResizing(true);
    const stopResizing = () => setIsResizing(false);

    const resize = (e: MouseEvent | TouchEvent | globalThis.MouseEvent | globalThis.TouchEvent) => {
        if (!isResizing || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;

        // Calculate new position relative to container width
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    };

    useEffect(() => {
        const handleGlobalMouseMove = (e: globalThis.MouseEvent) => resize(e);
        const handleGlobalTouchMove = (e: globalThis.TouchEvent) => resize(e);
        const handleGlobalMouseUp = () => stopResizing();
        const handleGlobalTouchEnd = () => stopResizing();

        if (isResizing) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('touchmove', handleGlobalTouchMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
            window.addEventListener('touchend', handleGlobalTouchEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('touchmove', handleGlobalTouchMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('touchend', handleGlobalTouchEnd);
        };
    }, [isResizing]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full select-none overflow-hidden group ${className}`}
            onMouseDown={startResizing}
            onTouchStart={startResizing}
        >
            {/* After Image (Full width, displayed behind) */}
            <Image
                src={afterImage}
                alt="After"
                fill
                className="object-cover"
                draggable={false}
                unoptimized
            />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10 z-10 pointer-events-none">
                Staged (After)
            </div>

            {/* Before Image (Foreground, clipped) */}
            <Image
                src={beforeImage}
                alt="Before"
                fill
                className="object-cover"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                }}
                draggable={false}
                unoptimized
            />
            <div
                className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10 z-20 pointer-events-none"
                style={{ opacity: sliderPosition < 10 ? 0 : 1 }}
            >
                Original (Before)
            </div>

            {/* Slider Handle Line */}
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-30 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderPosition}%` }}
            >
                {/* Handle Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95">
                    <MoveHorizontal size={14} className="text-black/80" />
                </div>
            </div>
        </div>
    );
};
