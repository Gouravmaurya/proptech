import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0F0F0F", // Deep Obsidian
                surface: "#1A1A1A",    // Card background
                primary: "#FFFFFF",    // Clean Slate
                accent: "#D4AF37",     // High-Contrast Gold for ROI/Cap Rate
                foreground: "#FFFFFF", // Default text to white for dark mode base
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;
