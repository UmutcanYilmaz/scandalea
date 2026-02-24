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
                scandalea: {
                    gold: "#D4AF37",         // Classic Gold
                    "gold-light": "#F1DFA0", // Pale Gold / Champagne
                    "gold-dark": "#AA8218",  // Antique Gold
                    crimson: "#9A0000",      // Deep Blood Red
                    obsidian: "#050505",     // Richer Black
                    charcoal: "#121212",     // Soft Black
                    silver: "#C0C0C0",
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
                serif: ['var(--font-playfair)'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-gold": "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%, #FBF5B7 150%)", // Metallic Gold
            },
            animation: {
                "fade-in": "fadeIn 1s ease-out forwards",
                "float": "float 6s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                }
            }
        },
    },
    plugins: [],
};
export default config;
