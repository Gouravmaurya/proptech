"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Home, Box, Compass } from "lucide-react";

const MESSAGES = {
  scout: [
    "Scouting smart deals...",
    "Analyzing ROI metrics...",
    "Reviewing pricing alerts...",
    "Optimizing cap rates...",
  ],
  staging: [
    "Loading furniture nodes...",
    "Rendering lighting vectors...",
    "Extrapolating 3D vertices...",
    "Applying high-end textures...",
  ],
  dream: [
    "Connecting imagination...",
    "Matching semantic descriptions...",
    "Searching visual index...",
    "Formulating floor plan maps...",
  ],
};

interface CreativeLoaderProps {
  type?: "scout" | "staging" | "dream";
}

export default function CreativeLoader({ type = "scout" }: CreativeLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const msgs = MESSAGES[type];

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % msgs.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [msgs]);

  const IconMap = { scout: Compass, staging: Box, dream: Home };
  const Icon = IconMap[type];

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8">
      {/* 3D Wireframe / Isometric Draw Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Pulsing Background Grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-[2rem] blur-xl" />
        
        {/* Rotating Circular Framing Track */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-dotted border-teal-500/20"
        />

        {/* Isometric SVG drawing frame */}
        <svg width="60" height="60" viewBox="0 0 60 60" className="absolute">
          <motion.path
            d="M 30 5 L 55 20 L 55 45 L 30 55 L 5 45 L 5 20 Z"
            fill="none"
            stroke="url(#emerald-grad)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.path
            d="M 30 5 L 30 55 M 5 20 L 30 35 L 55 20"
            fill="none"
            stroke="url(#teal-grad)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.4 }}
          />
          <defs>
            <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="teal-grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Center Icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-emerald-900/5 border border-white flex items-center justify-center border-t-emerald-200"
        >
          <Icon className="w-8 h-8 text-emerald-600" />
        </motion.div>

        {/* Orbiting Sparkles or Nodes */}
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 right-4"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </motion.div>
      </div>

      {/* Dynamic Text Messaging section */}
      <div className="text-center max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-slate-800 font-bold text-lg tracking-tight leading-snug">
              {msgs[msgIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
        
        {/* Progress Bar / Bar Indicator */}
        <div className="w-48 h-1 bg-slate-100 rounded-full mt-4 mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.25em] font-bold">Initializing Node Graph</p>
      </div>
    </div>
  );
}
