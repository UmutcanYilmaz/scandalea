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
                    gold: "#D4AF37",
                    crimson: "#D70040",
                    amber: "#C68E17",
                    violet: "#4B0082",
                    silver: "#E0E0E0",
                    dark: "#0a0a0a",
                },
                backgroundImage: {
                    "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                    "gradient-conic":
                        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
                serif: ['var(--font-playfair)'],
            }
        },
    },
    plugins: [],
};
export default config;
